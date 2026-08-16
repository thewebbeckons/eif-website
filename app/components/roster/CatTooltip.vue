<script setup lang="ts">
const { catNames } = defineProps<{
  catNames: string[];
}>();

const tooltipText = computed(() => `Cats: ${catNames.join(", ")}`);
</script>

<template>
  <UTooltip
    :text="tooltipText"
    :content="{ side: 'top' }"
    :ui="{
      content:
        'rounded-none border-2 border-black bg-stone-800 font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_black] ring-0',
    }"
  >
    <button
      type="button"
      :aria-label="tooltipText"
      class="relative -top-px flex cursor-help items-center text-xl transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
    >
      <span aria-hidden="true">🐱</span>
    </button>
  </UTooltip>
</template>
