<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>();
</script>

<template>
  <div
    class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
  >
    <div>
      <h1
        class="mb-2 text-5xl font-heading font-black uppercase tracking-tight text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] [-webkit-text-stroke:2px_black] md:text-6xl"
      >
        {{ title }}
      </h1>
      <p
        class="mt-2 inline-block border-2 border-black bg-black px-4 py-2 text-xl font-body font-bold text-white shadow-[4px_4px_0px_0px_rgba(216,180,254,1)] -skew-x-6"
      >
        {{ subtitle }}
      </p>
    </div>
    <slot />
  </div>
</template>
