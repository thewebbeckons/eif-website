// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2025-02-15",
  future: {
    compatibilityVersion: 4,
  },
  ui: {
    colorMode: false,
  },
});
