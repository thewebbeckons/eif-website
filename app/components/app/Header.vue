<script setup lang="ts">
const items = computed(() => [
  { label: 'News', to: '/news', variant: 'ghost', color: 'neutral' },
  { label: 'Streams', to: '/streams', variant: 'ghost', color: 'neutral' },
  { label: 'Roster', to: '/roster', variant: 'ghost', color: 'neutral' }
])
</script>

<template>
  <UHeader 
    :ui="{ 
      root: 'mx-4 lg:mx-auto max-w-7xl rounded-3xl border-2 border-black dark:border-white bg-white dark:bg-gray-900 shadow-[6px_6px_0_0_rgb(0,0,0)] z-50 fixed top-6 left-0 right-0', 
      container: 'px-6 py-2',
      center: 'hidden lg:flex'
    }"
  >
    <template #left>
      <AppLogo />
    </template>

    <template #default>
      <UNavigationMenu :items="items" :ui="{ link: 'text-lg' }" />
    </template>

    <template #right>
      <div class="flex items-center">
        <UButton class="font-bold bg-paladin-pink text-white border-2 border-transparent hover:border-black hover:bg-paladin-pink/90 active:translate-y-0.5 transition-all">
          Join Us
        </UButton>
      </div>
    </template>


    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" />
    </template>
  </UHeader>
</template>
