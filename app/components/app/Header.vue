<script setup lang="ts">
const items = computed(() => [
  { label: 'News', to: '/news', variant: 'ghost', color: 'neutral' },
  { label: 'Roster', to: '/roster', variant: 'ghost', color: 'neutral' }
])
</script>

<template>
  <UHeader 
    :ui="{ 
      root: 'mx-4 lg:mx-auto max-w-7xl rounded-3xl border-2 border-black dark:border-stone-600 bg-white dark:bg-stone-950 shadow-lg z-50 fixed top-6 left-0 right-0',
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
      <div class="flex items-center gap-3">
        <UButton color="primary" variant="solid" class="hidden lg:flex font-bold" @click="useJoinModal().open()">
          Join Us
        </UButton>
      </div>
    </template>


    <template #body>
      <div class="flex flex-col gap-4">
        <UNavigationMenu :items="items" orientation="vertical" />
        <UButton color="primary" variant="solid" class="w-full font-bold" @click="useJoinModal().open()">
          Join Us
        </UButton>
      </div>
    </template>
  </UHeader>
</template>
