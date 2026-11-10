<script setup lang="ts">
import type { TeamInput } from "../../../shared/types/members";

// Edits the team details in place; the parent owns submitting them.
const team = defineModel<TeamInput>({ required: true });

const dayOptions = WEEKDAYS.map((label, value) => ({ label, value }));
const timezoneOptions = computed(() => getTimezoneOptions(team.value.timezone));

function addSlot() {
  // Start from the day after the last one, with the same hours.
  const last = team.value.schedule.at(-1);
  team.value.schedule.push({
    day: last ? (last.day + 1) % 7 : 2,
    start: last?.start ?? "20:00",
    end: last?.end ?? "22:00",
  });
}

function changeNeed(role: keyof TeamInput["needs"], delta: number) {
  team.value.needs[role] = Math.min(
    Math.max(team.value.needs[role] + delta, 0),
    5,
  );
}
</script>

<template>
  <div class="space-y-5">
    <UFormField label="Team name">
      <UInput
        v-model="team.name"
        maxlength="40"
        required
        placeholder="Keys to Disaster"
        class="w-full"
      />
    </UFormField>
    <UFormField label="About the team (optional)">
      <UTextarea
        v-model="team.description"
        :rows="2"
        maxlength="500"
        placeholder="Goals, key levels, vibe..."
        class="w-full"
      />
    </UFormField>

    <fieldset>
      <legend class="mb-2 text-sm font-medium text-white">Run times</legend>
      <div class="space-y-3">
        <div
          v-for="(slot, index) in team.schedule"
          :key="index"
          class="flex flex-wrap items-center gap-2"
        >
          <USelect
            v-model="slot.day"
            :items="dayOptions"
            :aria-label="`Day for run time ${index + 1}`"
            class="w-36"
          />
          <UInput
            v-model="slot.start"
            type="time"
            required
            :aria-label="`Start time for run time ${index + 1}`"
          />
          <span class="font-black text-stone-400">to</span>
          <UInput
            v-model="slot.end"
            type="time"
            required
            :aria-label="`End time for run time ${index + 1}`"
          />
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="`Remove run time ${index + 1}`"
            class="text-stone-300 hover:bg-rose-600 hover:text-white"
            @click="team.schedule.splice(index, 1)"
          />
        </div>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-3">
        <UButton
          label="Add a run time"
          icon="i-lucide-plus"
          size="sm"
          color="neutral"
          :disabled="team.schedule.length >= 14"
          class="bg-stone-800 text-white hover:bg-stone-700"
          @click="addSlot"
        />
        <USelect
          v-model="team.timezone"
          :items="timezoneOptions"
          aria-label="Timezone"
          class="w-56"
        />
      </div>
    </fieldset>

    <fieldset class="border-t-4 border-black pt-5">
      <legend class="sr-only">Recruitment</legend>
      <USwitch
        v-model="team.recruiting"
        label="Open for recruitment"
        description="Lists the team on the recruitment page so members can ask to join."
      />

      <div v-if="team.recruiting" class="mt-5 space-y-5">
        <div>
          <p class="mb-2 text-sm font-medium text-white">
            How many of each role do you need?
          </p>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="role in TEAM_ROLES"
              :key="role.value"
              :class="[
                'flex items-center gap-2 border-2 px-3 py-2',
                team.needs[role.value] > 0
                  ? role.badgeClass
                  : 'border-black bg-stone-950 text-stone-400',
              ]"
            >
              <UIcon :name="role.icon" class="h-5 w-5" />
              <span class="font-black uppercase">{{ role.label }}</span>
              <button
                type="button"
                class="h-7 w-7 cursor-pointer border-2 border-black bg-stone-800 font-black text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                :aria-label="`One fewer ${role.label}`"
                :disabled="team.needs[role.value] <= 0"
                @click="changeNeed(role.value, -1)"
              >
                −
              </button>
              <span
                class="w-4 text-center text-lg font-black text-white"
                aria-live="polite"
                >{{ team.needs[role.value] }}</span
              >
              <button
                type="button"
                class="h-7 w-7 cursor-pointer border-2 border-black bg-stone-800 font-black text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
                :aria-label="`One more ${role.label}`"
                :disabled="team.needs[role.value] >= 5"
                @click="changeNeed(role.value, 1)"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <UFormField label="Recruitment post (optional)">
          <UTextarea
            v-model="team.recruitmentNote"
            :rows="3"
            maxlength="500"
            placeholder="What you are looking for: score, experience, attitude..."
            class="w-full"
          />
        </UFormField>
      </div>
    </fieldset>
  </div>
</template>
