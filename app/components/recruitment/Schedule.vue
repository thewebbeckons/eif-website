<script setup lang="ts">
import type { TeamSlot } from "../../../shared/types/members";

const props = defineProps<{ schedule: TeamSlot[]; timezone: string }>();

const slots = computed(() => sortSlots(props.schedule));
const zone = computed(() => formatTimezone(props.timezone));
</script>

<template>
  <p v-if="slots.length === 0" class="font-bold text-stone-400">
    No set run times yet.
  </p>
  <ul v-else class="space-y-1">
    <li
      v-for="(slot, index) in slots"
      :key="index"
      class="flex flex-wrap gap-x-3 font-bold text-white"
    >
      <span class="w-28 font-black uppercase tracking-wider text-cyan-300">{{
        WEEKDAYS[slot.day]
      }}</span>
      <span
        >{{ formatTime(slot.start) }} – {{ formatTime(slot.end) }}
        <span class="text-stone-400">{{ zone }}</span></span
      >
    </li>
  </ul>
</template>
