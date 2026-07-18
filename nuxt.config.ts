import prismicConfig from "./prismic.config.json";

const rosterRefreshCron = "*/10 * * * *";
const isPreviewCloudflareEnv = process.env.CLOUDFLARE_ENV === "preview";
const isDevelopment = process.env.NODE_ENV === "development";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/prismic", "@nuxthub/core"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2026-07-18",

  prismic: {
    endpoint: prismicConfig.repositoryName,
    clientConfig: {
      routes: prismicConfig.routes,
    },
  },

  ui: {
    fonts: false,
  },

  colorMode: {
    preference: "dark",
    fallback: "dark",
  },
  hub: {
    kv: isDevelopment
      ? {
          driver: "fs-lite",
          base: ".data/kv",
        }
      : {
          driver: "cloudflare-kv-binding",
          namespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
          binding: "KV",
        },
  },
  nitro: {
    compatibilityDate: "2026-07-18",
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
        observability: {
          enabled: true,
          head_sampling_rate: 1,
          logs: {
            enabled: true,
            head_sampling_rate: 1,
            invocation_logs: true,
          },
        },
        upload_source_maps: true,
        // @ts-expect-error Nitro's bundled config types lag Wrangler 4.112,
        // whose schema supports Workers Rate Limiting bindings.
        ratelimits: [
          {
            name: "RECRUITMENT_RATE_LIMITER",
            namespace_id: "140891719",
            simple: {
              limit: 2,
              period: 60,
            },
          },
          {
            name: "ROSTER_BUILD_RATE_LIMITER",
            namespace_id: "140891720",
            simple: {
              limit: 1,
              period: 60,
            },
          },
        ],
        triggers: {
          crons: isPreviewCloudflareEnv ? [] : [rosterRefreshCron],
        },
      },
    },
  },
  runtimeConfig: {
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
    raiderIoKey: process.env.RAIDER_IO_KEY,
    twitchClientId: process.env.TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
  },
});
