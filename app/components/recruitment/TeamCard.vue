<script setup lang="ts">
import type { Team } from "../../../shared/types/members";

const props = defineProps<{ team: Team }>();

const status = computed(() => {
  const { viewer } = props.team;
  if (viewer.isOwner) return "Owner";
  if (viewer.isMember) return "Member";
  if (viewer.pending === "invite") return "Invited";
  if (viewer.pending === "request") return "Request sent";
  return null;
});
const pendingRequests = computed(
  () => props.team.joins?.filter((join) => join.kind === "request").length ?? 0,
);
</script>

<template>
  <NuxtLink
    :to="`/recruitment/${team.id}`"
    class="flex flex-col border-4 border-black bg-stone-950 p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition duration-150 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3
          class="truncate text-2xl font-heading font-black uppercase text-white"
        >
          {{ team.name }}
        </h3>
        <p class="text-sm font-black uppercase tracking-wider text-stone-400">
          Led by {{ team.ownerName }} · {{ team.members.length }}
          {{ team.members.length === 1 ? "member" : "members" }}
        </p>
      </div>
      <span
        v-if="status"
        class="shrink-0 border-2 border-purple-400 bg-purple-400/10 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-purple-300"
      >
        {{ status }}
      </span>
    </div>

    <RecruitmentSchedule
      :schedule="team.schedule"
      :timezone="team.timezone"
      class="mt-4"
    />

    <div v-if="team.recruiting" class="mt-4 border-t-2 border-black pt-4">
      <RecruitmentNeeds :needs="team.needs" />
      <p
        v-if="team.recruitmentNote"
        class="mt-3 line-clamp-3 font-medium text-stone-300"
      >
        {{ team.recruitmentNote }}
      </p>
    </div>

    <p
      v-if="pendingRequests > 0"
      class="mt-4 font-black uppercase tracking-wider text-orange-400"
    >
      {{ pendingRequests }}
      {{ pendingRequests === 1 ? "request" : "requests" }} waiting on you
    </p>
  </NuxtLink>
</template>
