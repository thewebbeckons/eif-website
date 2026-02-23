<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  colorClass?: string
  loading?: boolean
  disabled?: boolean
  active?: boolean
  label?: string
}>()

const emit = defineEmits(['click'])

const handleClick = (e: MouseEvent) => {
  e.stopPropagation()
  if (!props.loading && !props.disabled) {
    emit('click', e)
  }
}

const color = computed(() => props.colorClass || 'bg-pink-400')
</script>

<template>
  <button
    @click="handleClick"
    :disabled="disabled || loading"
    :class="[
      color,
      'text-black font-black uppercase text-lg px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-in-out',
      'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
      'active:translate-x-[6px] active:translate-y-[6px] active:shadow-none',
      'flex items-center justify-center gap-2',
      { 'opacity-70 cursor-wait': loading, 'opacity-50 cursor-not-allowed': disabled }
    ]"
  >
    <UIcon v-if="loading" name="i-lucide-loader-circle" class="animate-spin w-5 h-5 shrink-0" />
    <slot name="leading"></slot>
    <slot>{{ label }}</slot>
    <slot name="trailing"></slot>
  </button>
</template>
