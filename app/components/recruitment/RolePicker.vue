<script setup lang="ts">
import type { TeamRole } from "../../../shared/types/members";

const role = defineModel<TeamRole | null>({ required: true });
</script>

<template>
  <div role="radiogroup" aria-label="Role" class="flex flex-wrap gap-3">
    <button
      v-for="option in TEAM_ROLES"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="role === option.value"
      :class="[
        'flex cursor-pointer items-center gap-2 border-2 px-4 py-2 font-black uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300',
        role === option.value
          ? option.badgeClass
          : 'border-black bg-stone-950 text-stone-400 hover:text-white',
      ]"
      @click="role = option.value"
    >
      <UIcon :name="option.icon" class="h-5 w-5" />
      {{ option.label }}
    </button>
  </div>
</template>
