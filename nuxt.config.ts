import prismicConfig from "./prismic.config.json";

const rosterRefreshCron = "*/10 * * * *";
const isDevelopment = process.env.NODE_ENV === "development";
const isPreviewCloudflareEnv = process.env.CLOUDFLARE_ENV === "preview";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/prismic", "@nuxthub/core", "@nuxt/scripts"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2025-02-15",

  icon: {
    clientBundle: {
      scan: {
        globInclude: ["app/**/*.{vue,ts}"],
        globExclude: ["node_modules", ".nuxt", ".output"],
      },
      icons: ["lucide:bow-arrow", "lucide:heart-pulse"],
    },
  },

  prismic: {
    endpoint: prismicConfig.repositoryName,
    clientConfig: {
      routes: prismicConfig.routes,
    },
  },

  colorMode: {
    preference: "dark",
    fallback: "dark",
  },
  hub: {
    kv: isDevelopment
      ? true
      : {
          driver: "cloudflare-kv-binding",
          namespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
          binding: "KV",
        },
  },
  nitro: {
    alias: {
      "node:console": "unenv/node/console",
    },
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
        compatibility_flags: ["nodejs_compat"],
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
