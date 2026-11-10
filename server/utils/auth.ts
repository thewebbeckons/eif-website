import type { H3Event } from "h3";

import type { SessionUser } from "../../shared/types/members";
import type { D1Db } from "./db";

const DISCORD_API = "https://discord.com/api/v10";
const SESSION_COOKIE = "eif-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
// How long a session is trusted before Discord server membership is re-checked.
const MEMBERSHIP_TTL_MS = 60 * 60 * 1000;
const DEV_SESSION_PASSWORD = "eif-local-dev-session-password-not-for-production";

interface AuthSessionData {
  userId?: string;
  accessToken?: string;
  checkedAt?: number;
}

export interface DiscordMember {
  nick?: string | null;
  avatar?: string | null;
  user: {
    id: string;
    username: string;
    global_name?: string | null;
    avatar?: string | null;
  };
}

export type MembershipResult =
  | { status: "member"; member: DiscordMember }
  | { status: "not-member" }
  | { status: "unavailable" };

interface UserRow {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

export function getAuthConfig(event: H3Event) {
  const config = useRuntimeConfig(event);
  const env = getCloudflareEnv(event);
  const pick = (configured: unknown, name: string): string => {
    const value = configured || env[name] || process.env[name];
    return typeof value === "string" ? value : "";
  };

  return {
    clientId: pick(config.discordClientId, "DISCORD_CLIENT_ID"),
    clientSecret: pick(config.discordClientSecret, "DISCORD_CLIENT_SECRET"),
    guildId: pick(config.discordGuildId, "DISCORD_GUILD_ID"),
    sessionPassword:
      pick(config.sessionPassword, "SESSION_PASSWORD") ||
      (import.meta.dev ? DEV_SESSION_PASSWORD : ""),
  };
}

export function getAuthSession(event: H3Event) {
  const { sessionPassword } = getAuthConfig(event);
  if (sessionPassword.length < 32) {
    throw fail(503, "Sign in is not configured.");
  }

  return useSession<AuthSessionData>(event, {
    name: SESSION_COOKIE,
    password: sessionPassword,
    maxAge: SESSION_MAX_AGE,
    cookie: { httpOnly: true, sameSite: "lax", secure: !import.meta.dev },
  });
}

/** Asks Discord, as the signed-in user, for their member record in our server. */
export async function fetchDiscordMembership(
  accessToken: string,
  guildId: string,
): Promise<MembershipResult> {
  try {
    const response = await fetch(
      `${DISCORD_API}/users/@me/guilds/${guildId}/member`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(8_000),
      },
    );

    if (response.ok) {
      return { status: "member", member: (await response.json()) as DiscordMember };
    }
    await response.body?.cancel();

    // 404 = not in the server; 401/403 = the token was revoked or expired.
    return [401, 403, 404].includes(response.status)
      ? { status: "not-member" }
      : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

export function toSessionUser(row: UserRow): SessionUser {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
  };
}

/** The signed-in user, or null. Re-checks Discord membership when it is stale. */
export async function getSessionUser(
  event: H3Event,
): Promise<{ user: SessionUser; db: D1Db } | null> {
  // Reading a session creates one, so skip visitors who have no cookie at all.
  if (!getCookie(event, SESSION_COOKIE)) return null;

  const session = await getAuthSession(event);
  const { userId, accessToken, checkedAt = 0 } = session.data;
  if (!userId) return null;

  if (accessToken && Date.now() - checkedAt > MEMBERSHIP_TTL_MS) {
    const { guildId } = getAuthConfig(event);
    const result = await fetchDiscordMembership(accessToken, guildId);
    if (result.status === "not-member") {
      await session.clear();
      return null;
    }
    // If Discord is unreachable, keep the session and try again next request.
    if (result.status === "member") {
      await session.update({ checkedAt: Date.now() });
    }
  }

  const db = await useDb(event);
  const row = await db
    .prepare("SELECT id, username, display_name, avatar_url FROM users WHERE id = ?")
    .bind(userId)
    .first<UserRow>();
  if (!row) {
    await session.clear();
    return null;
  }

  return { user: toSessionUser(row), db };
}

export async function requireUser(
  event: H3Event,
): Promise<{ user: SessionUser; db: D1Db }> {
  // The session cookie is SameSite=Lax; this also rejects cross-site writes
  // from browsers that send an Origin header.
  if (event.method !== "GET") {
    const origin = getHeader(event, "origin");
    if (origin && URL.parse(origin)?.host !== getRequestURL(event).host) {
      throw fail(403, "Cross-site requests are not allowed.");
    }
  }

  const signedIn = await getSessionUser(event);
  if (!signedIn) {
    throw fail(401, "Sign in with Discord to continue.");
  }
  return signedIn;
}

export async function signIn(
  event: H3Event,
  input: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    accessToken?: string;
  },
): Promise<void> {
  const db = await useDb(event);
  const now = new Date().toISOString();
  // display_name is only set on first sign-in so a member's own choice sticks.
  await db
    .prepare(
      `INSERT INTO users (id, username, avatar_url, display_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         username = excluded.username,
         avatar_url = excluded.avatar_url,
         updated_at = excluded.updated_at`,
    )
    .bind(
      input.id,
      input.username,
      input.avatarUrl,
      input.displayName.slice(0, 32),
      now,
      now,
    )
    .run();

  const session = await getAuthSession(event);
  await session.update({
    userId: input.id,
    accessToken: input.accessToken,
    checkedAt: Date.now(),
  });
}
