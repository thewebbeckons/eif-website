<script setup lang="ts">
import type {
  MemberProfile,
  MemberSearchResult,
  Team,
  TeamInput,
  TeamMember,
} from "../../../shared/types/members";
import type { JoinDetails } from "~/components/recruitment/JoinForm.vue";

const route = useRoute();
const { user } = useAuth();
const run = useApiAction();

const teamUrl = computed(() => `/api/teams/${route.params.id}`);

const {
  data: team,
  error,
  execute: loadTeam,
} = useLazyFetch<Team>(teamUrl, { server: false, immediate: false });
const { data: profile, execute: loadProfile } = useLazyFetch<MemberProfile>(
  "/api/me",
  { server: false, immediate: false },
);

// Runs once the browser session check resolves, and again after signing in.
watch(
  () => user.value?.id,
  (id) => {
    if (id) {
      loadTeam();
      loadProfile();
    }
  },
  { immediate: true },
);

useSeoMeta({
  title: () => team.value?.name || "Mythic+ Team",
  robots: "noindex",
});

const characters = computed(() => profile.value?.characters ?? []);
const requests = computed(
  () => team.value?.joins?.filter((join) => join.kind === "request") ?? [],
);
const invites = computed(
  () => team.value?.joins?.filter((join) => join.kind === "invite") ?? [],
);
const me = computed(() =>
  team.value?.members.find((member) => member.userId === user.value?.id),
);

const busy = ref(false);

/** Runs a change to the team, then reloads it so the page reflects the result. */
async function change(call: () => Promise<unknown>, success: string) {
  busy.value = true;
  const done = await run(call, success);
  if (done) await loadTeam();
  busy.value = false;
  return Boolean(done);
}

const post = (path: string, body?: Record<string, unknown>) =>
  $fetch(`${teamUrl.value}${path}`, { method: "POST", body });

// --- Joining ---
const requestToJoin = (details: JoinDetails) =>
  change(() => post("/requests", { ...details }), "Request sent");

const acceptInvite = ({ role, characterId }: JoinDetails) =>
  change(
    () =>
      post(`/joins/${user.value!.id}`, { action: "accept", role, characterId }),
    "Welcome to the team",
  );

const resolveJoin = (
  userId: string,
  action: "accept" | "decline",
  success: string,
) => change(() => post(`/joins/${userId}`, { action }), success);

// --- Your own spot ---
const spotOpen = ref(false);

async function updateSpot({ role, characterId }: JoinDetails) {
  const saved = await change(
    () =>
      $fetch(`${teamUrl.value}/members/${user.value!.id}`, {
        method: "PATCH",
        body: { role, characterId },
      }),
    "Your spot was updated",
  );
  if (saved) spotOpen.value = false;
}

async function removeMember(member: TeamMember) {
  const leaving = member.userId === user.value?.id;
  const removed = await change(
    () =>
      $fetch(`${teamUrl.value}/members/${member.userId}`, { method: "DELETE" }),
    leaving ? "You left the team" : `${member.displayName} was removed`,
  );
  if (removed && leaving) await navigateTo("/recruitment");
}

// --- Owner: edit and delete ---
const editOpen = ref(false);
const deleteOpen = ref(false);
const draft = ref<TeamInput>(createEmptyTeamInput());

function openEdit() {
  if (!team.value) return;
  const { name, description, timezone, recruiting, recruitmentNote } =
    team.value;
  draft.value = {
    name,
    description,
    timezone,
    recruiting,
    recruitmentNote,
    schedule: team.value.schedule.map((slot) => ({ ...slot })),
    needs: { ...team.value.needs },
  };
  editOpen.value = true;
}

async function saveTeam() {
  const saved = await change(
    () => $fetch(teamUrl.value, { method: "PATCH", body: draft.value }),
    "Team saved",
  );
  if (saved) editOpen.value = false;
}

async function deleteTeam() {
  busy.value = true;
  const deleted = await run(
    () => $fetch(teamUrl.value, { method: "DELETE" }),
    "Team deleted",
  );
  busy.value = false;
  if (deleted) await navigateTo("/recruitment");
}

// --- Owner: invite members ---
const search = ref("");
const searchResults = ref<MemberSearchResult[]>([]);
const searched = ref(false);

async function searchMembers() {
  const results = await run(() =>
    $fetch<MemberSearchResult[]>("/api/members", {
      query: { q: search.value },
    }),
  );
  searchResults.value = results ?? [];
  searched.value = true;
}

async function invite(member: MemberSearchResult) {
  const invited = await change(
    () => post("/invites", { userId: member.id }),
    `Invite sent to ${member.displayName}`,
  );
  if (invited) {
    searchResults.value = searchResults.value.filter(
      (result) => result.id !== member.id,
    );
  }
}
</script>

<template>
  <div class="min-h-screen pt-32 pb-24">
    <UContainer>
      <MembersPageHeader
        :title="team?.name || 'Mythic+ Team'"
        :subtitle="team ? `Led by ${team.ownerName}` : 'Recruitment'"
      >
        <UButton
          to="/recruitment"
          label="All teams"
          icon="i-lucide-arrow-left"
          color="neutral"
          class="bg-stone-800 text-white hover:bg-stone-700"
        />
      </MembersPageHeader>

      <MembersGate>
        <MembersPanel v-if="error && !team">
          <p class="py-10 text-center text-lg font-bold text-stone-200">
            {{
              error.statusCode === 404
                ? "This team does not exist any more."
                : "This team could not be loaded. Try again in a minute."
            }}
          </p>
        </MembersPanel>

        <MembersPanel v-else-if="!team">
          <p
            class="py-10 text-center text-xl font-black uppercase tracking-widest text-white"
          >
            Loading team...
          </p>
        </MembersPanel>

        <div v-else class="grid gap-8 lg:grid-cols-3">
          <div class="space-y-8 lg:col-span-2">
            <MembersPanel title="Details" eyebrow="The team">
              <template v-if="team.viewer.isOwner" #actions>
                <div class="flex gap-3">
                  <UButton
                    label="Edit"
                    icon="i-lucide-pencil"
                    size="sm"
                    class="bg-purple-500 text-white hover:bg-purple-600"
                    @click="openEdit"
                  />
                  <UButton
                    label="Delete"
                    icon="i-lucide-trash-2"
                    size="sm"
                    color="neutral"
                    class="bg-stone-800 text-white hover:bg-rose-600"
                    @click="deleteOpen = true"
                  />
                </div>
              </template>

              <p
                v-if="team.description"
                class="mb-5 whitespace-pre-line font-medium text-stone-200"
              >
                {{ team.description }}
              </p>
              <h3
                class="mb-2 text-sm font-black uppercase tracking-widest text-stone-400"
              >
                Run times
              </h3>
              <RecruitmentSchedule
                :schedule="team.schedule"
                :timezone="team.timezone"
              />

              <div class="mt-6 border-t-4 border-black pt-5">
                <template v-if="team.recruiting">
                  <RecruitmentNeeds :needs="team.needs" />
                  <p
                    v-if="team.recruitmentNote"
                    class="mt-3 whitespace-pre-line font-medium text-stone-200"
                  >
                    {{ team.recruitmentNote }}
                  </p>
                </template>
                <p v-else class="font-bold text-stone-400">
                  Not recruiting right now.
                </p>
              </div>
            </MembersPanel>

            <MembersPanel
              :title="`Members (${team.members.length})`"
              eyebrow="Roster"
            >
              <ul class="space-y-3">
                <li
                  v-for="member in team.members"
                  :key="member.userId"
                  class="flex flex-wrap items-center justify-between gap-3 border-2 border-black bg-stone-950 px-4 py-3"
                >
                  <div class="flex min-w-0 items-center gap-3">
                    <UAvatar
                      :src="member.avatarUrl || undefined"
                      :alt="member.displayName"
                      size="md"
                      class="rounded-none border-2 border-black"
                    />
                    <div class="min-w-0">
                      <p
                        class="truncate font-black uppercase tracking-tight text-white"
                      >
                        {{ member.displayName }}
                        <span
                          v-if="member.isOwner"
                          class="ml-1 text-xs tracking-wider text-purple-300"
                          >Owner</span
                        >
                      </p>
                      <p
                        v-if="member.character"
                        :class="[
                          'text-xs font-bold uppercase tracking-wider',
                          getWowClassTextColor(member.character.class),
                        ]"
                      >
                        {{ formatCharacter(member.character) }} ·
                        {{ member.character.class }}
                      </p>
                      <p
                        v-else
                        class="text-xs font-bold uppercase tracking-wider text-stone-500"
                      >
                        Character not picked yet
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span
                      :class="[
                        'inline-flex items-center gap-1.5 border-2 px-2.5 py-1 text-sm font-black uppercase',
                        getTeamRole(member.role).badgeClass,
                      ]"
                    >
                      <UIcon
                        :name="getTeamRole(member.role).icon"
                        class="h-4 w-4"
                      />
                      {{ getTeamRole(member.role).label }}
                    </span>
                    <UButton
                      v-if="member.userId === user?.id"
                      label="Change"
                      size="xs"
                      color="neutral"
                      class="bg-stone-800 text-white hover:bg-stone-700"
                      @click="spotOpen = true"
                    />
                    <UButton
                      v-if="
                        !member.isOwner &&
                        (team.viewer.isOwner || member.userId === user?.id)
                      "
                      :label="member.userId === user?.id ? 'Leave' : 'Remove'"
                      size="xs"
                      color="neutral"
                      :disabled="busy"
                      class="bg-stone-800 text-white hover:bg-rose-600"
                      @click="removeMember(member)"
                    />
                  </div>
                </li>
              </ul>
            </MembersPanel>
          </div>

          <div class="space-y-8">
            <!-- What the viewer can do depends on how they relate to the team. -->
            <MembersPanel
              v-if="team.viewer.pending === 'invite'"
              title="You are invited"
              eyebrow="Invite"
            >
              <p class="mb-4 font-bold text-stone-300">
                {{ team.ownerName }} wants you on this team. Pick what you will
                play to accept.
              </p>
              <RecruitmentJoinForm
                :characters="characters"
                submit-label="Accept invite"
                :loading="busy"
                @submit="acceptInvite"
              />
              <UButton
                label="Decline"
                color="neutral"
                :disabled="busy"
                class="mt-3 bg-stone-800 text-white hover:bg-rose-600"
                @click="resolveJoin(user!.id, 'decline', 'Invite declined')"
              />
            </MembersPanel>

            <MembersPanel
              v-else-if="team.viewer.pending === 'request'"
              title="Request sent"
              eyebrow="Waiting"
            >
              <p class="mb-4 font-bold text-stone-300">
                {{ team.ownerName }} has your request. You will show up in the
                members list once it is accepted.
              </p>
              <UButton
                label="Withdraw request"
                color="neutral"
                :disabled="busy"
                class="bg-stone-800 text-white hover:bg-rose-600"
                @click="resolveJoin(user!.id, 'decline', 'Request withdrawn')"
              />
            </MembersPanel>

            <MembersPanel
              v-else-if="!team.viewer.isMember && team.recruiting"
              title="Ask to join"
              eyebrow="Recruiting"
            >
              <RecruitmentJoinForm
                :characters="characters"
                submit-label="Request to join"
                with-message
                :loading="busy"
                @submit="requestToJoin"
              />
            </MembersPanel>

            <template v-if="team.viewer.isOwner">
              <MembersPanel
                :title="`Requests (${requests.length})`"
                eyebrow="Want to join"
              >
                <p v-if="requests.length === 0" class="font-bold text-stone-400">
                  No one is waiting on an answer.
                </p>
                <ul v-else class="space-y-4">
                  <li
                    v-for="join in requests"
                    :key="join.userId"
                    class="border-2 border-black bg-stone-950 p-4"
                  >
                    <p class="font-black uppercase text-white">
                      {{ join.displayName }}
                      <span class="text-sm text-cyan-300"
                        >· {{ getTeamRole(join.role).label }}</span
                      >
                    </p>
                    <p
                      v-if="join.character"
                      :class="[
                        'text-xs font-bold uppercase tracking-wider',
                        getWowClassTextColor(join.character.class),
                      ]"
                    >
                      {{ formatCharacter(join.character) }} ·
                      {{ join.character.class }}
                    </p>
                    <p
                      v-if="join.message"
                      class="mt-2 whitespace-pre-line font-medium text-stone-300"
                    >
                      {{ join.message }}
                    </p>
                    <div class="mt-3 flex gap-3">
                      <UButton
                        label="Accept"
                        size="sm"
                        :disabled="busy"
                        class="bg-cyan-400 text-black hover:bg-cyan-300"
                        @click="
                          resolveJoin(
                            join.userId,
                            'accept',
                            `${join.displayName} joined the team`,
                          )
                        "
                      />
                      <UButton
                        label="Decline"
                        size="sm"
                        color="neutral"
                        :disabled="busy"
                        class="bg-stone-800 text-white hover:bg-rose-600"
                        @click="
                          resolveJoin(join.userId, 'decline', 'Request declined')
                        "
                      />
                    </div>
                  </li>
                </ul>
              </MembersPanel>

              <MembersPanel title="Invite a member" eyebrow="Invites">
                <form class="flex gap-3" @submit.prevent="searchMembers">
                  <UInput
                    v-model="search"
                    placeholder="Search by name"
                    aria-label="Search members by name"
                    minlength="2"
                    maxlength="32"
                    required
                    class="min-w-0 flex-1"
                  />
                  <UButton
                    type="submit"
                    icon="i-lucide-search"
                    aria-label="Search"
                    class="bg-purple-500 text-white hover:bg-purple-600"
                  />
                </form>
                <p class="mt-2 text-sm font-medium text-stone-400">
                  Members appear here once they have signed in to the site.
                </p>

                <ul v-if="searchResults.length > 0" class="mt-4 space-y-2">
                  <li
                    v-for="result in searchResults"
                    :key="result.id"
                    class="flex items-center justify-between gap-3 border-2 border-black bg-stone-950 px-3 py-2"
                  >
                    <span class="truncate font-black uppercase text-white">{{
                      result.displayName
                    }}</span>
                    <UButton
                      label="Invite"
                      size="xs"
                      :disabled="busy"
                      class="bg-cyan-400 text-black hover:bg-cyan-300"
                      @click="invite(result)"
                    />
                  </li>
                </ul>
                <p
                  v-else-if="searched"
                  class="mt-4 font-bold text-stone-400"
                >
                  No members match that name.
                </p>

                <template v-if="invites.length > 0">
                  <h3
                    class="mt-6 mb-2 text-sm font-black uppercase tracking-widest text-stone-400"
                  >
                    Waiting to accept
                  </h3>
                  <ul class="space-y-2">
                    <li
                      v-for="join in invites"
                      :key="join.userId"
                      class="flex items-center justify-between gap-3 border-2 border-black bg-stone-950 px-3 py-2"
                    >
                      <span class="truncate font-black uppercase text-white">{{
                        join.displayName
                      }}</span>
                      <UButton
                        label="Cancel"
                        size="xs"
                        color="neutral"
                        :disabled="busy"
                        class="bg-stone-800 text-white hover:bg-rose-600"
                        @click="
                          resolveJoin(join.userId, 'decline', 'Invite cancelled')
                        "
                      />
                    </li>
                  </ul>
                </template>
              </MembersPanel>
            </template>
          </div>
        </div>
      </MembersGate>

      <UModal
        v-model:open="editOpen"
        title="Edit team"
        description="Update the team details, run times and recruitment post."
        :ui="{ content: 'max-w-2xl' }"
      >
        <template #body>
          <form class="space-y-5" @submit.prevent="saveTeam">
            <RecruitmentTeamForm v-model="draft" />
            <div class="flex justify-end gap-3 pt-2">
              <UButton
                label="Cancel"
                color="neutral"
                class="bg-stone-800 text-white hover:bg-stone-700"
                @click="editOpen = false"
              />
              <UButton
                type="submit"
                label="Save team"
                :loading="busy"
                class="bg-cyan-400 text-black hover:bg-cyan-300"
              />
            </div>
          </form>
        </template>
      </UModal>

      <UModal
        v-model:open="spotOpen"
        title="Your spot"
        description="Change the role and character you bring to this team."
      >
        <template #body>
          <RecruitmentJoinForm
            :characters="characters"
            :initial-role="me?.role"
            submit-label="Save"
            :loading="busy"
            @submit="updateSpot"
          />
        </template>
      </UModal>

      <UModal
        v-model:open="deleteOpen"
        title="Delete this team?"
        :description="`${team?.name || 'This team'} and its members, invites and requests will be removed. This cannot be undone.`"
      >
        <template #body>
          <div class="flex justify-end gap-3">
            <UButton
              label="Keep team"
              color="neutral"
              class="bg-stone-800 text-white hover:bg-stone-700"
              @click="deleteOpen = false"
            />
            <UButton
              label="Delete team"
              :loading="busy"
              class="bg-rose-600 text-white hover:bg-rose-500"
              @click="deleteTeam"
            />
          </div>
        </template>
      </UModal>
    </UContainer>
  </div>
</template>
