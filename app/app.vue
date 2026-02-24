<script setup lang="ts">
import InteractiveBackground from "~/components/home/InteractiveBackground.vue";

useHead({
  link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
});

useSeoMeta({
  title: "Exercise in Futility",
  titleTemplate: "%s | World of Warcraft Guild",
  description:
    "Exercise in Futility is a World of Warcraft guild on US-Illidan focused on community and progression. Join us for a fun and active environment.",
  ogTitle: "Exercise in Futility | World of Warcraft Guild",
  ogDescription:
    "Exercise in Futility is a World of Warcraft guild on US-Illidan focused on community and progression. Join us for a fun and active environment.",
  ogImage: "/void-seo.jpg",
  twitterCard: "summary_large_image",
  twitterImage: "/void-seo.jpg",
});
</script>

<template>
  <UApp>
    <InteractiveBackground />
    <div class="relative z-10 flex flex-col min-h-screen">
      <AppHeader />
      <UMain>
        <NuxtPage />
      </UMain>
      <AppFooter />
      <AppJoinModal />
    </div>
  </UApp>
</template>
