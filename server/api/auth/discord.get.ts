const STATE_COOKIE = "eif-oauth-state";

// Handles both legs of the Discord OAuth flow: with no `code` it sends the
// browser to Discord; Discord then redirects back here with one.
export default defineEventHandler(async (event) => {
  const { clientId, clientSecret, guildId } = getAuthConfig(event);
  const query = getQuery(event);
  const failTo = (reason: string) =>
    sendRedirect(event, `/account?error=${reason}`);

  // Local development without a Discord application: sign in as a stand-in
  // member. `?as=<name>` picks which one, to test multi-user flows.
  if (import.meta.dev && !clientId) {
    const name = String(query.as || "Dev User").slice(0, 32);
    await signIn(event, {
      id: `dev-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      username: name.toLowerCase().replace(/\s+/g, ""),
      displayName: name,
      avatarUrl: null,
    });
    return sendRedirect(event, "/account");
  }

  if (!clientId || !clientSecret || !guildId) {
    return failTo("config");
  }

  const redirectUri = `${getRequestURL(event).origin}/api/auth/discord`;
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: !import.meta.dev,
    path: "/",
  };

  if (query.error) {
    return failTo("denied");
  }

  if (typeof query.code !== "string") {
    const state = crypto.randomUUID();
    setCookie(event, STATE_COOKIE, state, { ...cookieOptions, maxAge: 600 });

    const authorize = new URL("https://discord.com/oauth2/authorize");
    authorize.search = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: "identify guilds.members.read",
      state,
      prompt: "none",
    }).toString();
    return sendRedirect(event, authorize.toString());
  }

  const expectedState = getCookie(event, STATE_COOKIE);
  deleteCookie(event, STATE_COOKIE, cookieOptions);
  if (!expectedState || expectedState !== query.state) {
    return failTo("expired");
  }

  let accessToken: string;
  try {
    const token = await $fetch<{ access_token: string }>(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code: query.code,
          redirect_uri: redirectUri,
        }),
        timeout: 8_000,
      },
    );
    accessToken = token.access_token;
  } catch (error) {
    console.error("Discord token exchange failed", error);
    return failTo("discord");
  }

  const membership = await fetchDiscordMembership(accessToken, guildId);
  if (membership.status === "unavailable") {
    return failTo("discord");
  }
  if (membership.status === "not-member") {
    return failTo("not-member");
  }

  const { member } = membership;
  const avatarUrl = member.avatar
    ? `https://cdn.discordapp.com/guilds/${guildId}/users/${member.user.id}/avatars/${member.avatar}.png?size=128`
    : member.user.avatar
      ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=128`
      : null;

  await signIn(event, {
    id: member.user.id,
    username: member.user.username,
    displayName:
      member.nick || member.user.global_name || member.user.username,
    avatarUrl,
    accessToken,
  });

  return sendRedirect(event, "/account");
});
