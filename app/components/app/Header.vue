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
      root: 'mx-4 lg:mx-auto max-w-7xl mt-6 rounded-3xl border-2 border-black dark:border-white bg-white dark:bg-gray-900 shadow-[6px_6px_0_0_rgb(0,0,0)] z-50 sticky top-6', 
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
      <div class="flex items-center gap-2">
        <UButton color="neutral" variant="ghost" to="/login" class="font-bold">Log In</UButton>
        <UButton color="neutral" variant="solid" to="/signup" class="font-bold border-2 border-transparent hover:border-black active:translate-y-0.5 transition-all">Get Started</UButton>
      </div>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" />
    </template>
  </UHeader>
</template>
