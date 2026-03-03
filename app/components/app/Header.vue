<script setup lang="ts">
import { motion } from "motion-v";

const items = computed(() => [
  { label: "News", to: "/news" },
  { label: "Streams", to: "/streams" },
  { label: "Roster", to: "/roster" },
]);

const schittsCreekGifs = [
  "https://media.giphy.com/media/xUA7b2zzeFPdRtBMek/giphy.gif",
  "https://media.giphy.com/media/l0Ex6Ut39Zj7DzJn2/giphy.gif",
  "https://media.giphy.com/media/UWJOhdyCXIGt5RcKSq/giphy.gif",
  "https://media.giphy.com/media/fVzdH5xUnvqwpCCqdl/giphy.gif",
  "https://media.giphy.com/media/Q8UvE3ISdNWfww5YaU/giphy.gif",
  "https://media.giphy.com/media/SSKgkYJtpsYWCTFSng/giphy.gif",
  "https://media.giphy.com/media/VgZzoLgZeukZRhxrpW/giphy.gif",
  "https://media.giphy.com/media/cLw4RZHnJCIcR9uMhP/giphy.gif",
  "https://media.giphy.com/media/hVb0lLoOLpB6TzxY6v/giphy.gif",
  "https://media.giphy.com/media/U2KuGfM27RgLWeTF0q/giphy.gif",
];

const selectedGif = ref("");
const onOpenGifModal = (open: boolean) => {
  if (open) {
    selectedGif.value =
      schittsCreekGifs[Math.floor(Math.random() * schittsCreekGifs.length)] ||
      "";
  }
};
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

    <template #right>
      <UModal @update:open="onOpenGifModal">
        <UButton
          size="sm"
          icon="i-lucide-sparkles"
          color="neutral"
          variant="ghost"
          aria-label="Random Schitt's Creek GIF"
          class="text-stone-300 hover:text-white bg-purple-500 hover:bg-purple-600 cursor-pointer hidden sm:block"
        />
        <template #content>
          <div
            class="p-1 max-w-max mx-auto border border-stone-800 rounded-xl bg-stone-900 shadow-2xl relative overflow-hidden"
          >
            <img
              :src="selectedGif"
              class="rounded-lg object-contain max-h-[80vh]"
              alt="Schitt's Creek GIF"
            />
          </div>
        </template>
      </UModal>
    </template>

    <template #default>
      <UNavigationMenu
        :items="items"
        :ui="{
          link: 'text-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none rounded-md',
        }"
      />
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
      </motion.div>
    </template>
  </UHeader>
</template>
