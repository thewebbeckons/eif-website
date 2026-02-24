// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/content", "nuxt-studio"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2025-02-15",

  colorMode: {
    preference: "dark",
    fallback: "dark",
  },
  runtimeConfig: {
    twitchClientId: process.env.TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
  },
  routeRules: {
    "/api/streams": { swr: 600 },
    "/": { swr: 1800 },
  },
});
