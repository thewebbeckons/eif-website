import slicemachineConfig from "./slicemachine.config.json";

const repositoryName = String(slicemachineConfig.repositoryName);
const rosterRefreshCron = "*/10 * * * *";
const isPreviewCloudflareEnv = process.env.CLOUDFLARE_ENV === "preview";
const apiEndpoint =
  "apiEndpoint" in slicemachineConfig &&
  typeof slicemachineConfig.apiEndpoint === "string"
    ? slicemachineConfig.apiEndpoint
    : undefined;
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/prismic", "@nuxthub/core"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2025-02-15",

  prismic: {
    endpoint: apiEndpoint || repositoryName,
    clientConfig: {
      // `type` is the API ID of a page type.
      // `path` determines the URL for a page of that type.
      routes: [{ type: "news", path: "/news/:uid" }],
    },
  },

  colorMode: {
    preference: "dark",
    fallback: "dark",
  },
  hub: {
    kv: {
      driver: "cloudflare-kv-binding",
      namespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
      binding: "KV",
    },
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: isPreviewCloudflareEnv
      ? {}
      : {
          [rosterRefreshCron]: ["roster:refresh"],
        },
    cloudflare: {
      wrangler: {
        triggers: {
          crons: isPreviewCloudflareEnv ? [] : [rosterRefreshCron],
        },
      },
    },
  },
  runtimeConfig: {
    raiderIoKey: process.env.RAIDER_IO_KEY,
    twitchClientId: process.env.TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
  },
});
