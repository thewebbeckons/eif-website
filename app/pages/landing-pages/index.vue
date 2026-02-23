<script setup lang="ts">
const variants = [
  { name: 'Retro Arcade', path: '/landing-pages/retro-arcade', description: 'Pixel-art inspired with neon glow, scanlines, and 8-bit charm', color: 'bg-mage-blue' },
  { name: 'Glassmorphism', path: '/landing-pages/glassmorphism', description: 'Frosted glass panels, soft gradients, and dreamy blur effects', color: 'bg-paladin-pink' },
  { name: 'Sticker Collage', path: '/landing-pages/sticker-collage', description: 'Scrapbook vibes with rotated stickers, tape, and playful chaos', color: 'bg-rogue-yellow' },
  { name: 'Gradient Wave', path: '/landing-pages/gradient-wave', description: 'Bold flowing gradients, organic wave shapes, and smooth motion', color: 'bg-loot-purple' },
  { name: 'Candy Pop', path: '/landing-pages/candy-pop', description: 'Bubbly shapes, bouncy animations, and sweet candy colors', color: 'bg-monk-green' },
]
</script>

<template>
  <div class="min-h-screen bg-paladin-pink dark:bg-stone-950 pt-32 pb-20">
    <UContainer>
      <div class="text-center mb-16 space-y-4">
        <h1 class="font-heading font-black text-5xl md:text-7xl uppercase tracking-tight text-gray-900 dark:text-stone-100">
          Landing Page <span class="relative inline-block"><span class="relative z-10">Lab</span><span class="absolute -bottom-1 left-0 right-0 h-5 md:h-7 bg-rogue-yellow/60 dark:bg-rogue-yellow/40 -rotate-1 rounded-sm" /></span>
        </h1>
        <p class="text-gray-600 dark:text-stone-400 text-lg font-medium max-w-xl mx-auto">
          5 different style experiments for the EIF landing page. Same content, different vibes.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <NuxtLink
          v-for="variant in variants"
          :key="variant.path"
          :to="variant.path"
          class="group relative rounded-3xl border-2 border-black dark:border-stone-600 bg-white dark:bg-stone-900 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
        >
          <div class="h-40 flex items-center justify-center" :class="variant.color + '/30'">
            <span class="font-heading font-black text-3xl uppercase text-gray-900 dark:text-stone-100 group-hover:scale-110 transition-transform duration-300">
              {{ variant.name }}
            </span>
          </div>
          <div class="p-6">
            <h3 class="font-heading font-bold text-lg mb-2 text-gray-900 dark:text-stone-100">{{ variant.name }}</h3>
            <p class="text-gray-500 dark:text-stone-400 text-sm font-medium">{{ variant.description }}</p>
          </div>
          <div class="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-black dark:border-stone-500 bg-white dark:bg-stone-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <UIcon name="i-lucide-arrow-right" class="w-5 h-5 text-gray-900 dark:text-stone-100" />
          </div>
        </NuxtLink>
      </div>

      <div class="text-center mt-12">
        <UButton to="/" color="neutral" variant="outline" size="lg" class="font-bold">
          <template #leading>
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          </template>
          Back to Current Site
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
