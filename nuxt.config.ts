import slicemachineConfig from "./slicemachine.config.json";

const repositoryName = String(slicemachineConfig.repositoryName);
const apiEndpoint =
  "apiEndpoint" in slicemachineConfig &&
  typeof slicemachineConfig.apiEndpoint === "string"
    ? slicemachineConfig.apiEndpoint
    : undefined;
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/prismic"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2026-01-15",

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
