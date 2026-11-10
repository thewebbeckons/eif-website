<script setup lang="ts">
import type {
  Team,
  TeamListResponse,
  TeamRole,
} from "../../../shared/types/members";

useSeoMeta({ title: "Mythic+ Recruitment", robots: "noindex" });

const { user } = useAuth();
const run = useApiAction();

const { data: teams, execute: loadTeams } = useLazyFetch<TeamListResponse>(
  "/api/teams",
  { server: false, immediate: false },
);

// Runs once the browser session check resolves, and again after signing in.
watch(
  () => user.value?.id,
  (id) => {
    if (id) loadTeams();
  },
  { immediate: true },
);

const createOpen = ref(false);
const creating = ref(false);
const draft = ref(createEmptyTeamInput());
const ownRole = ref<TeamRole | null>(null);

function openCreate() {
  draft.value = {
    ...createEmptyTeamInput(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  ownRole.value = null;
  createOpen.value = true;
}

async function createTeam() {
  creating.value = true;
  const team = await run(
    () =>
      $fetch<Team>("/api/teams", {
        method: "POST",
        body: { ...draft.value, role: ownRole.value },
      }),
    "Team created",
  );
  creating.value = false;
  if (team) {
    createOpen.value = false;
    await navigateTo(`/recruitment/${team.id}`);
  }
}
</script>

<template>
  <div class="min-h-screen pt-32 pb-24">
    <UContainer>
      <MembersPageHeader
        title="Recruitment"
        subtitle="Mythic+ teams looking for players"
      >
        <UButton
          v-if="user"
          label="Create a team"
          icon="i-lucide-plus"
          size="xl"
          class="bg-cyan-400 text-black hover:bg-cyan-300"
          @click="openCreate"
        />
      </MembersPageHeader>

      <MembersGate>
        <MembersPanel v-if="!teams">
          <p
            class="py-10 text-center text-xl font-black uppercase tracking-widest text-white"
          >
            Loading teams...
          </p>
        </MembersPanel>

        <div v-else class="space-y-10">
          <MembersPanel
            v-if="teams.invited.length > 0"
            title="You have been invited"
            eyebrow="Invites"
          >
            <div class="grid gap-6 md:grid-cols-2">
              <RecruitmentTeamCard
                v-for="team in teams.invited"
                :key="team.id"
                :team="team"
              />
            </div>
          </MembersPanel>

          <MembersPanel title="Your teams" eyebrow="Teams">
            <div
              v-if="teams.mine.length > 0"
              class="grid gap-6 md:grid-cols-2"
            >
              <RecruitmentTeamCard
                v-for="team in teams.mine"
                :key="team.id"
                :team="team"
              />
            </div>
            <p v-else class="font-bold text-stone-300">
              You are not on a team yet. Create one, or ask to join a team
              below.
            </p>
          </MembersPanel>

          <MembersPanel title="Looking for players" eyebrow="Open recruitment">
            <div
              v-if="teams.recruiting.length > 0"
              class="grid gap-6 md:grid-cols-2"
            >
              <RecruitmentTeamCard
                v-for="team in teams.recruiting"
                :key="team.id"
                :team="team"
              />
            </div>
            <p v-else class="font-bold text-stone-300">
              No other teams are recruiting right now. Check back soon.
            </p>
          </MembersPanel>
        </div>
      </MembersGate>

      <UModal
        v-model:open="createOpen"
        title="Create a team"
        description="Set up your Mythic+ team. You can change all of this later."
        :ui="{ content: 'max-w-2xl' }"
      >
        <template #body>
          <form class="space-y-5" @submit.prevent="createTeam">
            <RecruitmentTeamForm v-model="draft" />
            <UFormField
              label="Your role on the team"
              class="border-t-4 border-black pt-5"
            >
              <RecruitmentRolePicker v-model="ownRole" />
            </UFormField>
            <div class="flex justify-end gap-3 pt-2">
              <UButton
                label="Cancel"
                color="neutral"
                class="bg-stone-800 text-white hover:bg-stone-700"
                @click="createOpen = false"
              />
              <UButton
                type="submit"
                label="Create team"
                :loading="creating"
                :disabled="!ownRole"
                class="bg-cyan-400 text-black hover:bg-cyan-300"
              />
            </div>
          </form>
        </template>
      </UModal>
    </UContainer>
  </div>
</template>
