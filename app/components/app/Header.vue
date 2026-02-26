<script setup lang="ts">
import { motion } from "motion-v";

const items = computed(() => [
  { label: "News", to: "/news" },
  { label: "Streams", to: "/streams" },
  { label: "Roster", to: "/roster" },
]);

const { open } = useJoinModal();
</script>

<template>
  <UHeader
    :ui="{
      root: 'mx-4 lg:mx-auto max-w-7xl rounded-3xl border-2 border-black bg-stone-900 shadow-[6px_6px_0_0_rgb(0,0,0)] z-50 fixed top-6 left-0 right-0',
      container: 'px-6 py-2',
      center: 'hidden lg:flex',
      content: 'bg-stone-900 border-l-2 border-black',
      header: 'bg-stone-900',
      body: 'bg-stone-900',
    }"
    :toggle="{
      class:
        'text-stone-300 hover:text-white hover:bg-zinc-800 transition-colors',
    }"
  >
    <template #left>
      <AppLogo />
    </template>

    <template #default>
      <UNavigationMenu
        :items="items"
        :ui="{
          link: 'text-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none rounded-md',
        }"
      />
    </template>

    <template #right>
      <UButton
        color="primary"
        variant="solid"
        class="hidden lg:flex"
        @click="open"
      >
        Join Us
      </UButton>
    </template>

    <template #body>
      <motion.div
        class="flex flex-col gap-4"
        :initial="{ opacity: 0, x: -20, filter: 'blur(4px)' }"
        :animate="{ opacity: 1, x: 0, filter: 'blur(0px)' }"
        :transition="{
          duration: 0.4,
          delay: 0.1,
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }"
      >
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{
            link: 'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none rounded-md',
          }"
        />
        <UButton
          color="primary"
          variant="solid"
          class="w-full justify-center"
          @click="open"
        >
          Join Us
        </UButton>
      </motion.div>
    </template>
  </UHeader>
</template>
