<script setup lang="ts">
import type { TeamNeeds } from "../../../shared/types/members";

const props = defineProps<{ needs: TeamNeeds }>();

const wanted = computed(() =>
  TEAM_ROLES.filter((role) => props.needs[role.value] > 0),
);
const total = computed(
  () => props.needs.tank + props.needs.healer + props.needs.dps,
);
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="mr-1 text-sm font-black uppercase tracking-wider text-white">
      Looking for {{ total }}:
    </span>
    <span
      v-for="role in wanted"
      :key="role.value"
      :class="[
        'inline-flex items-center gap-1.5 border-2 px-2.5 py-1 text-sm font-black uppercase',
        role.badgeClass,
      ]"
    >
      <UIcon :name="role.icon" class="h-4 w-4" />
      {{ needs[role.value] }} {{ role.label }}
    </span>
  </div>
</template>
