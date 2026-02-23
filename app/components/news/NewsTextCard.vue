<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'highlight'
}>()
</script>

<template>
  <div 
    class="w-full p-6 md:p-8 border-4 border-black text-lg md:text-xl font-medium leading-relaxed shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform"
    :class="[
      variant === 'highlight' 
        ? 'bg-emerald-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
        : 'bg-zinc-800 text-zinc-100 shadow-[6px_6px_0px_0px_rgba(244,114,182,1)]'
    ]"
  >
    <div 
      class="prose max-w-none prose-p:mb-4 prose-headings:font-black prose-headings:uppercase prose-a:font-bold custom-prose"
      :class="[
        variant === 'highlight' 
          ? 'prose-emerald text-black!' 
          : 'prose-zinc prose-invert text-zinc-100!'
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Base overrides */
:deep(h2) {
  margin-top: 0;
  text-shadow: 2px 2px 0px rgba(0,0,0,1);
}

/* Custom dark prose colors (overriding the default prose-invert colors to match our theme) */
.prose-zinc {
  --tw-prose-headings: #ffffff;
  --tw-prose-links: #f472b6; /* pink-400 */
  --tw-prose-bold: #ffffff;
  --tw-prose-body: #f4f4f5; /* zinc-100 */
}

/* Custom highlight prose colors */
.prose-emerald {
  --tw-prose-headings: #000000;
  --tw-prose-links: #7e22ce; /* purple-700 */
  --tw-prose-bold: #000000;
  --tw-prose-body: #000000;
}

.bg-emerald-400 :deep(h2), .bg-emerald-400 :deep(strong) {
  text-shadow: none;
}
</style>
