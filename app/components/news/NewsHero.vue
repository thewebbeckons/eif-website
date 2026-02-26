<script setup lang="ts">
defineProps<{
  title: string;
  date: string;
  author?: string;
  originalDate?: string;
  tag?: string;
  image?: string;
  imageAlt?: string;
}>();
</script>

<template>
  <div class="w-full flex flex-col gap-6">
    <!-- Image Header -->
    <div
      v-if="image"
      class="w-full h-64 md:h-96 border-4 border-black relative overflow-hidden bg-purple-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <img
        :src="image"
        :alt="imageAlt || title"
        class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
      />
      <div
        v-if="tag"
        class="absolute top-4 left-4 bg-yellow-400 text-black border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        {{ tag }}
      </div>
    </div>

    <!-- Title Area (No Image case or below image) -->
    <div
      class="bg-zinc-800 border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(168,85,247,1)] relative"
    >
      <div
        v-if="!image && tag"
        class="inline-block bg-yellow-400 text-black border-4 border-black px-4 py-1 font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4"
      >
        {{ tag }}
      </div>
      <h1
        class="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 style-text-shadow"
      >
        {{ title }}
      </h1>
      <div
        class="text-pink-400! font-bold uppercase tracking-widest text-sm flex items-center gap-2 flex-wrap"
      >
        <UIcon name="i-lucide-calendar" class="w-4 h-4" />
        {{ date }}
        <UTooltip
          v-if="originalDate && originalDate !== date"
          :text="`Original Draft: ${originalDate}`"
        >
          <UIcon
            name="i-lucide-info"
            class="w-4 h-4 text-pink-300 hover:text-white transition-colors cursor-help"
          />
        </UTooltip>
        <template v-if="author">
          <span class="text-gray-500 mx-1">•</span>
          <UIcon name="i-lucide-user" class="w-4 h-4" />
          <span class="text-white">{{ author }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-text-shadow {
  text-shadow: 4px 4px 0px rgba(168, 85, 247, 1);
}
</style>
