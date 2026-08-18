const rosterRefreshCron = "*/10 * * * *";
const isDevelopment = process.env.NODE_ENV === "development";
const isPreviewCloudflareEnv = process.env.CLOUDFLARE_ENV === "preview";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/content", "@nuxthub/core", "@nuxt/scripts"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2025-02-15",

  components: [
    // Registered globally so markdown can use them as MDC blocks (::news-quote)
    { path: "~/components/news", global: true },
    "~/components",
  ],

  content: {
    experimental: {
      nativeSqlite: true,
    },
  },

  icon: {
    clientBundle: {
      scan: {
        globInclude: ["app/**/*.{vue,ts}"],
        globExclude: ["node_modules", ".nuxt", ".output"],
      },
      icons: ["lucide:bow-arrow", "lucide:heart-pulse"],
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
    prerender: {
      // Content-backed routes are baked at build time so the Worker never needs
      // a runtime content database. Crawling picks up each /news/<slug> post
      // from the news index. /hall-of-fame reads a committed JSON file, so it
      // bakes too rather than hitting the API at runtime.
      crawlLinks: true,
      routes: ["/", "/news", "/hall-of-fame"],
      ignore: ["/roster", "/streams", "/apply", "/api"],
      autoSubfolderIndex: false,
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
