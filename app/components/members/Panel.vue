<script setup lang="ts">
defineProps<{ title?: string; eyebrow?: string }>();
</script>

<template>
  <section
    class="border-4 border-black bg-stone-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <div
      v-if="title || $slots.actions"
      class="mb-5 flex flex-wrap items-start justify-between gap-3"
    >
      <div>
        <p
          v-if="eyebrow"
          class="mb-1 text-xs font-black uppercase tracking-[0.35em] text-cyan-300"
        >
          {{ eyebrow }}
        </p>
        <h2 class="text-2xl font-heading font-black uppercase text-white">
          {{ title }}
        </h2>
      </div>
      <slot name="actions" />
    </div>
    <slot />
  </section>
</template>
