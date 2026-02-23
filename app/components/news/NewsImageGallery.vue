<script setup lang="ts">
interface ImageItem {
  url: string
  alt?: string
  caption?: string
}

defineProps<{
  images: ImageItem[]
  columns?: 1 | 2 | 3
}>()
</script>

<template>
  <div class="w-full">
    <div 
      class="grid gap-6"
      :class="[
        columns === 1 ? 'grid-cols-1' : 
        columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 
        'grid-cols-1 md:grid-cols-2'
      ]"
    >
      <div 
        v-for="(img, idx) in images" 
        :key="idx" 
        class="group relative flex flex-col bg-zinc-800 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(168,85,247,1)] transition-all transform hover:-translate-y-1"
      >
        <div class="overflow-hidden border-b-4 border-black aspect-video bg-zinc-900">
          <img 
            :src="img.url" 
            :alt="img.alt || 'Gallery image'" 
            class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>
        <div v-if="img.caption" class="p-4 bg-zinc-800 text-zinc-300 text-sm font-bold uppercase tracking-wide custom-caption">
          {{ img.caption }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-caption {
  color: #d4d4d8 !important; /* zinc-300 equivalent */
}
</style>
