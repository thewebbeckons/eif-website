import { apiEndpoint, repositoryName } from "./slicemachine.config.json";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/prismic"],
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
  runtimeConfig: {
    twitchClientId: process.env.TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
  },
});
