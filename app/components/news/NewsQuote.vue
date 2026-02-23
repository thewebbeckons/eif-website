<script setup lang="ts">
defineProps<{
  quote: string
  author?: string
  role?: string
}>()
</script>

<template>
  <div class="w-full relative p-8 md:p-12 bg-zinc-900 border-4 border-black z-10">
    <!-- Decorative background offset -->
    <div class="absolute -inset-2 bg-pink-500 -z-10 border-4 border-black translate-x-4 translate-y-4"></div>
    
    <UIcon name="i-lucide-quote" class="text-pink-400 w-12 h-12 mb-4 opacity-50 absolute top-4 left-4" />
    
    <blockquote class="relative z-10 pt-4">
      <p class="text-2xl md:text-4xl font-black text-white italic leading-tight uppercase tracking-tight mb-6" style="color: white !important;">
        "{{ quote }}"
      </p>
      <footer v-if="author" class="flex flex-col">
        <span class="text-yellow-400 font-bold text-xl uppercase tracking-wider">— {{ author }}</span>
        <span v-if="role" class="text-zinc-400 text-sm font-bold uppercase tracking-widest mt-1">{{ role }}</span>
      </footer>
    </blockquote>
  </div>
</template>
