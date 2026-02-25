import { createClient } from "@prismicio/client";

export default defineCachedEventHandler(
  async (event) => {
    const config = useRuntimeConfig();
    const { twitchClientId, twitchClientSecret } = config;

    if (!twitchClientId || !twitchClientSecret) {
      console.error("Twitch credentials missing in environment.");
      return [];
    }

    // 1. Get Twitch OAuth App Access Token
    let accessToken = "";
    try {
      const tokenResponse = await $fetch<{ access_token: string }>(
        "https://id.twitch.tv/oauth2/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: twitchClientId,
            client_secret: twitchClientSecret,
            grant_type: "client_credentials",
          }),
        },
      );
      accessToken = tokenResponse.access_token;
    } catch (error) {
      console.error("Error fetching Twitch access token:", error);
      return [];
    }

    if (!accessToken) return [];

    // 2. Read streamers from Prismic
    const client = createClient("eif-guild");
    let contentStreamers: any[] = [];
    try {
      const streamersDoc = await client.getSingle("streamers");
      contentStreamers = streamersDoc.data.streamers || [];
    } catch (error) {
      console.error("Error fetching streamers from Prismic:", error);
      return [];
    }

    if (contentStreamers.length === 0) return [];

    // 3. Prepare login names for Twitch API
    const logins = contentStreamers
      .map((s) => s.twitch_user)
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
      // 4. Get Twitch Users (for profile images)
      const usersQuery = new URLSearchParams();
      logins.forEach((login) => usersQuery.append("login", login));

      const usersResponse: any = await fetchTwitch("users", usersQuery);
      const usersData = usersResponse?.data || [];

      // Map offline streams first
      const mappedStreams = logins.map((login) => {
        const user = usersData.find((u: any) => u.login === login);
        const contentData = contentStreamers.find(
          (s) => String(s.twitch_user).toLowerCase() === login,
        );

        return {
          id: user?.id || login,
          streamerName:
            contentData?.display_name || user?.display_name || login,
          title: "Offline",
          game: "",
          viewers: 0,
          thumbnailUrl: user?.offline_image_url || "/offline_stream_sm.jpg",
          avatarUrl:
            user?.profile_image_url ||
            "https://api.dicebear.com/9.x/pixel-art/svg",
          isLive: false,
        };
      });

      // 5. Get Active Streams
      const streamsQuery = new URLSearchParams();
      logins.forEach((login) => streamsQuery.append("user_login", login));

      const streamsResponse: any = await fetchTwitch("streams", streamsQuery);
      const activeStreams = streamsResponse?.data || [];

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
    } catch (error) {
      console.error("Error fetching data from Twitch API:", error);
      return [];
    }
  },
  {
    maxAge: 60 * 5, // Cache for 5 minutes
  },
);
