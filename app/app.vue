<script setup lang="ts">
import InteractiveBackground from '~/components/home/InteractiveBackground.vue'
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
