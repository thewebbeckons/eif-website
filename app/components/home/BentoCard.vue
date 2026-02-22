<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  colorClass?: string
  className?: string
}>()

const computedClass = computed(() => {
  return [
    'group flex flex-col border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]',
    'transition-all duration-300 ease-out hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)]',
    'overflow-hidden',
    props.colorClass || '',
    props.className || ''
  ].filter(Boolean).join(' ')
})
</script>

<template>
  <div :class="computedClass">
    <slot></slot>
  </div>
</template>
