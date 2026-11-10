<script setup lang="ts">
import type { MemberCharacter, TeamRole } from "../../../shared/types/members";

// Role + character (+ optional note): used to request a spot, accept an
// invite, and change your own spot.
export interface JoinDetails {
  role: TeamRole;
  characterId: string | null;
  message: string;
}

const props = defineProps<{
  characters: MemberCharacter[];
  submitLabel: string;
  withMessage?: boolean;
  loading?: boolean;
  initialRole?: TeamRole;
}>();
const emit = defineEmits<{ submit: [details: JoinDetails] }>();

// USelect cannot hold null, so "no character" travels as this placeholder.
const NO_CHARACTER = "none";
const role = ref<TeamRole | null>(props.initialRole ?? null);
const characterId = ref(NO_CHARACTER);
const message = ref("");

const characterOptions = computed(() => [
  { label: "Decide later", value: NO_CHARACTER },
  ...props.characters.map((character) => ({
    label: `${character.name} (${character.class})`,
    value: character.id,
  })),
]);

function submit() {
  if (!role.value) return;
  emit("submit", {
    role: role.value,
    characterId:
      characterId.value === NO_CHARACTER ? null : characterId.value,
    message: message.value,
  });
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <UFormField label="Role">
      <RecruitmentRolePicker v-model="role" />
    </UFormField>
    <UFormField
      label="Character"
      :help="
        characters.length === 0
          ? 'Add characters on your account page to pick one here.'
          : undefined
      "
    >
      <USelect
        v-model="characterId"
        :items="characterOptions"
        class="w-full"
      />
    </UFormField>
    <UFormField v-if="withMessage" label="Note for the team owner (optional)">
      <UTextarea
        v-model="message"
        :rows="2"
        maxlength="300"
        placeholder="Experience, availability, favourite affix to complain about..."
        class="w-full"
      />
    </UFormField>
    <UButton
      type="submit"
      :label="submitLabel"
      :loading="loading"
      :disabled="!role"
      class="bg-cyan-400 text-black hover:bg-cyan-300"
    />
  </form>
</template>
