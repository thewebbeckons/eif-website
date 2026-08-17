import { createClient } from "@prismicio/client";
import type { H3Event } from "h3";
import { z } from "zod";

import prismicConfig from "../../prismic.config.json";
import type { GuildStream } from "../../shared/types/stream";

const twitchTokenSchema = z.object({ access_token: z.string() });
const twitchUserSchema = z.object({
  id: z.string(),
  login: z.string(),
  display_name: z.string(),
  profile_image_url: z.string().default(""),
  offline_image_url: z.string().default(""),
});
const twitchChannelSchema = z.object({
  broadcaster_id: z.string(),
  title: z.string().default(""),
  game_name: z.string().default(""),
});
const twitchStreamSchema = z.object({
  user_id: z.string(),
  title: z.string(),
  game_name: z.string(),
  viewer_count: z.number(),
  thumbnail_url: z.string(),
});
const twitchUsersResponseSchema = z.object({ data: z.array(twitchUserSchema) });
const twitchChannelsResponseSchema = z.object({
  data: z.array(twitchChannelSchema),
});
const twitchStreamsResponseSchema = z.object({
  data: z.array(twitchStreamSchema),
});
const streamerDocumentSchema = z.object({
  data: z.object({
    streamers: z.array(
      z.object({
        display_name: z.string().nullable(),
        twitch_user: z.string().nullable(),
      }),
    ),
  }),
});

const getTwitchCredentials = (event: H3Event) => {
  const config = useRuntimeConfig(event);
  const environment = getCloudflareEnvironment(event);

  return {
    clientId:
      config.twitchClientId ||
      getEnvironmentString(environment, "TWITCH_CLIENT_ID") ||
      getEnvironmentString(environment, "TWITCH_ID"),
    clientSecret:
      config.twitchClientSecret ||
      getEnvironmentString(environment, "TWITCH_CLIENT_SECRET"),
  };
};

export default defineCachedEventHandler(
  async (event): Promise<GuildStream[]> => {
    const { clientId, clientSecret } = getTwitchCredentials(event);

    if (!clientId || !clientSecret) {
      logWorkerError(
        "streams.credentials_missing",
        new Error("Twitch credentials are not configured."),
      );
      return [];
    }

    try {
      const tokenResponse = await $fetch(
        "https://id.twitch.tv/oauth2/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials",
          }),
          timeout: 8_000,
          retry: 1,
        },
      );
      const { access_token: accessToken } = twitchTokenSchema.parse(tokenResponse);

      const client = createClient(prismicConfig.repositoryName);
      const streamerDocument = streamerDocumentSchema.parse(
        await client.getSingle("streamers"),
      );
      const contentStreamers = streamerDocument.data.streamers.filter(
        (streamer) => streamer.twitch_user,
      );
      const logins = contentStreamers.map((streamer) =>
        String(streamer.twitch_user).toLowerCase(),
      );

      if (logins.length === 0) return [];

      const fetchTwitch = async <T>(
        endpoint: string,
        query: URLSearchParams,
        schema: z.ZodType<T>,
      ): Promise<T> => {
        const response = await $fetch(
          `https://api.twitch.tv/helix/${endpoint}?${query.toString()}`,
          {
            headers: {
              "Client-ID": clientId,
              Authorization: `Bearer ${accessToken}`,
            },
            timeout: 8_000,
            retry: 1,
          },
        );

        return schema.parse(response);
      };

      const usersQuery = new URLSearchParams();
      logins.forEach((login) => usersQuery.append("login", login));

      const streamsQuery = new URLSearchParams();
      logins.forEach((login) => streamsQuery.append("user_login", login));

      const [{ data: users }, { data: activeStreams }] = await Promise.all([
        fetchTwitch("users", usersQuery, twitchUsersResponseSchema),
        fetchTwitch("streams", streamsQuery, twitchStreamsResponseSchema),
      ]);

      const channelsQuery = new URLSearchParams();
      users.forEach((user) =>
        channelsQuery.append("broadcaster_id", user.id),
      );
      const channels = users.length
        ? (
            await fetchTwitch(
              "channels",
              channelsQuery,
              twitchChannelsResponseSchema,
            )
          ).data
        : [];

      return logins.map((login): GuildStream => {
        const user = users.find((candidate) => candidate.login === login);
        const channel = channels.find(
          (candidate) => candidate.broadcaster_id === user?.id,
        );
        const content = contentStreamers.find(
          (candidate) => candidate.twitch_user?.toLowerCase() === login,
        );
        const live = activeStreams.find(
          (candidate) => candidate.user_id === user?.id,
        );

        return {
          id: user?.id || login,
          streamerName: content?.display_name || user?.display_name || login,
          twitchUrl: `https://www.twitch.tv/${user?.login || login}`,
          title: live?.title || channel?.title || "Offline",
          game: live?.game_name || channel?.game_name || "",
          viewers: live?.viewer_count || 0,
          thumbnailUrl: live
            ? live.thumbnail_url
                .replace("{width}", "1280")
                .replace("{height}", "720")
            : user?.offline_image_url || "/offline_stream_sm.jpg",
          avatarUrl:
            user?.profile_image_url ||
            "https://api.dicebear.com/9.x/pixel-art/svg",
          isLive: Boolean(live),
        };
      });
    } catch (error) {
      logWorkerError("streams.refresh_failed", error);
      return [];
    }
  },
  { maxAge: 300 },
);
