import { repositoryName } from "./slicemachine.config.json";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/prismic"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2025-02-15",
  routeRules: {
    // Cache roster page HTML and API payload for 10 minutes.
    "/roster": { swr: 600 },
    "/api/roster": { swr: 600 },
  },

  prismic: {
    endpoint: repositoryName,
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
  runtimeConfig: {
    twitchClientId: process.env.TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
  },
});
