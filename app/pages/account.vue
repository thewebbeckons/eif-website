<script setup lang="ts">
import type {
  MemberCharacter,
  MemberProfile,
  SessionUser,
} from "../../shared/types/members";

useSeoMeta({ title: "Your Account", robots: "noindex" });

const { user } = useAuth();
const run = useApiAction();

const characters = ref<MemberCharacter[]>([]);
const loaded = ref(false);
const displayName = ref("");
const savingName = ref(false);
const adding = ref(false);
const newCharacter = reactive({ name: "", realm: "Illidan", region: "us" });

const REGIONS = ["us", "eu", "kr", "tw"].map((region) => ({
  label: region.toUpperCase(),
  value: region,
}));

// Runs once the browser session check resolves, and again after signing in.
watch(
  () => user.value?.id,
  async (id) => {
    if (!id) return;
    const profile = await run(() => $fetch<MemberProfile>("/api/me"));
    if (!profile) return;
    characters.value = profile.characters;
    displayName.value = profile.user.displayName;
    loaded.value = true;
  },
  { immediate: true },
);

const nameChanged = computed(
  () => displayName.value.trim() !== user.value?.displayName,
);

async function saveDisplayName() {
  savingName.value = true;
  const updated = await run(
    () =>
      $fetch<SessionUser>("/api/me", {
        method: "PATCH",
        body: { displayName: displayName.value },
      }),
    "Display name saved",
  );
  if (updated) {
    user.value = updated;
    displayName.value = updated.displayName;
  }
  savingName.value = false;
}

async function addCharacter() {
  adding.value = true;
  const character = await run(
    () =>
      $fetch<MemberCharacter>("/api/me/characters", {
        method: "POST",
        body: newCharacter,
      }),
    "Character added",
  );
  if (character) {
    characters.value.push(character);
    newCharacter.name = "";
  }
  adding.value = false;
}

async function setShowOnRoster(character: MemberCharacter, show: boolean) {
  character.showOnRoster = show;
  const saved = await run(
    () =>
      $fetch(`/api/me/characters/${character.id}`, {
        method: "PATCH",
        body: { showOnRoster: show },
      }),
    show
      ? `${character.name} is now on the roster`
      : `${character.name} is off the roster`,
  );
  if (!saved) character.showOnRoster = !show;
}

async function removeCharacter(character: MemberCharacter) {
  const removed = await run(
    () => $fetch(`/api/me/characters/${character.id}`, { method: "DELETE" }),
    `${character.name} removed`,
  );
  if (removed) {
    characters.value = characters.value.filter(
      (entry) => entry.id !== character.id,
    );
  }
}
</script>

<template>
  <div class="min-h-screen pt-32 pb-24">
    <UContainer>
      <MembersPageHeader title="Your Account" subtitle="Exercise in Futility" />

      <MembersGate v-slot="{ user: member }">
        <div class="grid gap-8 lg:grid-cols-3">
          <MembersPanel title="Profile" eyebrow="Who you are" class="self-start">
            <div class="flex items-center gap-4">
              <UAvatar
                :src="member.avatarUrl || undefined"
                :alt="member.displayName"
                size="3xl"
                class="rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <div class="min-w-0">
                <p class="truncate text-xl font-black uppercase text-white">
                  {{ member.displayName }}
                </p>
                <p class="truncate text-sm font-bold text-stone-400">
                  @{{ member.username }} on Discord
                </p>
              </div>
            </div>

            <form class="mt-6" @submit.prevent="saveDisplayName">
              <UFormField
                label="Display name"
                help="Shown on your teams and to other members."
              >
                <UInput
                  v-model="displayName"
                  maxlength="32"
                  required
                  class="w-full"
                />
              </UFormField>
              <UButton
                type="submit"
                label="Save"
                :loading="savingName"
                :disabled="!nameChanged || displayName.trim().length < 2"
                class="mt-4 bg-purple-500 text-white hover:bg-purple-600"
              />
            </form>
          </MembersPanel>

          <MembersPanel
            title="Characters"
            eyebrow="Your characters"
            class="lg:col-span-2"
          >
            <p class="mb-5 font-bold text-stone-300">
              Add the characters you play, then choose which ones appear on the
              <NuxtLink to="/roster" class="text-cyan-300 underline"
                >guild roster</NuxtLink
              >. You can also bring them to Mythic+ teams.
            </p>

            <p v-if="!loaded" class="py-6 font-black uppercase text-stone-400">
              Loading characters...
            </p>
            <p
              v-else-if="characters.length === 0"
              class="border-2 border-dashed border-stone-700 px-4 py-6 text-center font-bold text-stone-400"
            >
              No characters yet. Add your first one below.
            </p>
            <ul v-else class="space-y-3">
              <li
                v-for="character in characters"
                :key="character.id"
                class="flex flex-wrap items-center justify-between gap-4 border-2 border-black bg-stone-950 px-4 py-3"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <UAvatar
                    :src="character.thumbnailUrl || undefined"
                    :alt="character.name"
                    size="lg"
                    class="rounded-none border-2 border-black"
                  />
                  <div class="min-w-0">
                    <p
                      class="truncate text-lg font-black uppercase tracking-tight text-white"
                    >
                      {{ character.name }}
                    </p>
                    <p class="text-xs font-bold uppercase tracking-wider">
                      <span :class="getWowClassTextColor(character.class)">{{
                        character.class
                      }}</span>
                      <span class="text-stone-400">
                        · {{ character.realm }} ({{
                          character.region.toUpperCase()
                        }})</span
                      >
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <USwitch
                    :model-value="character.showOnRoster"
                    label="Show on roster"
                    @update:model-value="setShowOnRoster(character, $event)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    :aria-label="`Remove ${character.name}`"
                    class="text-stone-300 hover:bg-rose-600 hover:text-white"
                    @click="removeCharacter(character)"
                  />
                </div>
              </li>
            </ul>

            <form
              class="mt-6 grid gap-4 border-t-4 border-black pt-6 sm:grid-cols-[1fr_1fr_6rem_auto] sm:items-end"
              @submit.prevent="addCharacter"
            >
              <UFormField label="Character name">
                <UInput
                  v-model="newCharacter.name"
                  placeholder="Vyrron"
                  maxlength="24"
                  required
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Realm">
                <UInput
                  v-model="newCharacter.realm"
                  maxlength="40"
                  required
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Region">
                <USelect
                  v-model="newCharacter.region"
                  :items="REGIONS"
                  class="w-full"
                />
              </UFormField>
              <UButton
                type="submit"
                label="Add"
                icon="i-lucide-plus"
                :loading="adding"
                class="justify-center bg-cyan-400 text-black hover:bg-cyan-300"
              />
            </form>
            <p class="mt-3 text-sm font-medium text-stone-400">
              Characters are checked against Raider.IO, so they need a profile
              there.
            </p>
          </MembersPanel>
        </div>
      </MembersGate>
    </UContainer>
  </div>
</template>
