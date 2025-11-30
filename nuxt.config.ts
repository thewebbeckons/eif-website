// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "nuxt-studio", "@nuxt/content"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2025-02-15", 
  content: {
    
  }
});