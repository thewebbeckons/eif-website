import streamersData from "../assets/streamers.json";

const getTwitchCredentials = (event: any) => {
  const config = useRuntimeConfig(event);
  const cloudflareEnv =
    event.context?._platform?.cloudflare?.env ||
    event.context?.cloudflare?.env ||
    {};

  return {
    clientId:
      config.twitchClientId ||
      cloudflareEnv.TWITCH_CLIENT_ID ||
      cloudflareEnv.TWITCH_ID ||
      process.env.TWITCH_CLIENT_ID ||
      process.env.TWITCH_ID,
    clientSecret:
      config.twitchClientSecret ||
      cloudflareEnv.TWITCH_CLIENT_SECRET ||
      process.env.TWITCH_CLIENT_SECRET,
  };
};

// App access tokens last ~60 days, so reuse one for as long as this isolate
// lives instead of requesting a new token on every cache refresh.
let cachedToken: { value: string; expiresAt: number } | null = null;

const getAppAccessToken = async (clientId: string, clientSecret: string) => {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const { access_token, expires_in } = await $fetch<{
    access_token: string;
    expires_in: number;
  }>("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  // Refresh a minute early so a token never expires mid-request.
  cachedToken = {
    value: access_token,
    expiresAt: Date.now() + Math.max(expires_in - 60, 0) * 1000,
  };
  return access_token;
};

export default defineCachedEventHandler(
  async (event) => {
    const { clientId: twitchClientId, clientSecret: twitchClientSecret } =
      getTwitchCredentials(event);

    if (!twitchClientId || !twitchClientSecret) {
      console.error("Twitch credentials missing in environment.");
      return [];
    }

    // 1. Get (or reuse) a Twitch OAuth app access token
    let accessToken = "";
    try {
      accessToken = await getAppAccessToken(twitchClientId, twitchClientSecret);
    } catch (error) {
      console.error("Error fetching Twitch access token:", error);
      return [];
    }

    if (!accessToken) return [];

    // 2. Read the guild's streamers
    const contentStreamers = streamersData.streamers ?? [];

    if (contentStreamers.length === 0) return [];

    // 3. Prepare login names for Twitch API
    const logins = contentStreamers
      .map((s) => s.twitchUser)
      .filter(Boolean)
      .map((login) => String(login).toLowerCase());

    if (logins.length === 0) return [];

    // Helper for Twitch API calls
    const fetchTwitch = async (
      endpoint: string,
      queryParams: URLSearchParams,
    ) => {
      return $fetch(
        `https://api.twitch.tv/helix/${endpoint}?${queryParams.toString()}`,
        {
          headers: {
            "Client-ID": twitchClientId,
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    };

    try {
      // 4. Get Twitch users (profile images) and active streams in parallel;
      // neither depends on the other.
      const usersQuery = new URLSearchParams();
      logins.forEach((login) => usersQuery.append("login", login));
      const streamsQuery = new URLSearchParams();
      logins.forEach((login) => streamsQuery.append("user_login", login));

      const [usersResponse, streamsResponse]: any[] = await Promise.all([
        fetchTwitch("users", usersQuery),
        fetchTwitch("streams", streamsQuery),
      ]);
      const usersData = usersResponse?.data || [];
      const activeStreams = streamsResponse?.data || [];

      // 4.5 Get Channels info (for offline title/game)
      const userIds = usersData.map((u: any) => u.id);
      let channelsData: any[] = [];
      if (userIds.length > 0) {
        const channelsQuery = new URLSearchParams();
        userIds.forEach((id: string) =>
          channelsQuery.append("broadcaster_id", id),
        );
        const channelsResponse: any = await fetchTwitch(
          "channels",
          channelsQuery,
        );
        channelsData = channelsResponse?.data || [];
      }

      // Map offline streams first
      const mappedStreams = logins.map((login) => {
        const user = usersData.find((u: any) => u.login === login);
        const channel = channelsData.find(
          (c: any) => c.broadcaster_id === user?.id,
        );
        const contentData = contentStreamers.find(
          (s) => String(s.twitchUser).toLowerCase() === login,
        );

        return {
          id: user?.id || login,
          streamerName:
            contentData?.displayName || user?.display_name || login,
          twitchUrl: `https://www.twitch.tv/${user?.login || login}`,
          title: channel?.title || "Offline",
          game: channel?.game_name || "",
          viewers: 0,
          thumbnailUrl: user?.offline_image_url || "/offline_stream_sm.jpg",
          avatarUrl:
            user?.profile_image_url ||
            "https://api.dicebear.com/9.x/pixel-art/svg",
          isLive: false,
        };
      });

      // 6. Merge Live Stream Data
      const results = mappedStreams.map((stream) => {
        const liveData = activeStreams.find(
          (active: any) =>
            active.user_login === stream.id.toLowerCase() ||
            active.user_id === stream.id,
        );

        if (liveData) {
          return {
            ...stream,
            title: liveData.title,
            game: liveData.game_name,
            viewers: liveData.viewer_count,
            thumbnailUrl: liveData.thumbnail_url
              .replace("{width}", "1280")
              .replace("{height}", "720"),
            isLive: true,
          };
        }
        return stream;
      });

      return results;
    } catch (error: any) {
      // A revoked or expired token: drop it so the next refresh gets a new one.
      if (error?.statusCode === 401) cachedToken = null;
      console.error("Error fetching data from Twitch API:", error);
      return [];
    }
  },
  {
    maxAge: 60 * 5, // Cache for 5 minutes
  },
);
