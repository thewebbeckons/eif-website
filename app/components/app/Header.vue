<script setup lang="ts">
const items = computed(() => [
  { label: 'News', to: '/news' },
  { label: 'Streams', to: '/streams' },
  { label: 'Roster', to: '/roster' }
])
</script>

<template>
  <UHeader 
    :ui="{ 
      root: 'mx-4 lg:mx-auto max-w-7xl rounded-3xl border-2 border-black bg-stone-900 shadow-[6px_6px_0_0_rgb(0,0,0)] z-50 fixed top-6 left-0 right-0', 
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
      <UButton color="primary" variant="solid">
        Join Us
      </UButton>
    </template>


    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" />
    </template>
  </UHeader>
</template>
