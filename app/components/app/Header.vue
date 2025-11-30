<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <header class="py-1 sticky top-8 z-10">
    <UContainer
      class=" flex flex-row justify-between items-center rounded-full py-3 border-4 border-(--ui-border-muted) bg-white dark:bg-(--ui-bg-muted)">
      <AppLogo class=" object-fit" />
      <nav class="flex flex-row space-x-4 items-center">
        <UButton color="primary" variant="link" to="/news">News</UButton>
        <UButton color="primary" variant="link" to="/streams">Streams</UButton>
        <UButton color="primary" variant="link" to="/roster">Roster</UButton>
        <!-- <UButton color="primary" variant="link" to="/events">Events</UButton> -->
        <UButton color="primary" variant="soft" @click="console.log('Sign Up clicked')" class="cursor-pointer">
          Join Us
        </UButton>
        <ClientOnly>
          <UButton :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="neutral"
            variant="ghost" aria-label="Theme" @click="isDark = !isDark" />
          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>
      </nav>
    </UContainer>
  </header>
</template>
