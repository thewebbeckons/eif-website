<script setup lang="ts">
defineProps<{
  variant?: "default" | "highlight";
}>();
</script>

<template>
  <div
    class="w-full p-6 md:p-8 border-4 border-black text-lg md:text-xl font-medium leading-relaxed shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform"
    :class="[
      variant === 'highlight'
        ? 'bg-emerald-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
        : 'bg-zinc-800 text-zinc-100 shadow-[6px_6px_0px_0px_rgba(244,114,182,1)]',
    ]"
  >
    <div
      class="prismic-rich-text"
      :class="[
        variant === 'highlight'
          ? 'prismic-rich-text-highlight text-black!'
          : 'text-zinc-100!',
      ]"
    >
      <slot />
    </div>
  </div>
</template>
