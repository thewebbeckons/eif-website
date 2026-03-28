<script lang="ts" setup>
import type { TableColumn } from "@nuxt/ui";
import type {
  RosterBestRun,
  RosterPlayer,
  RosterResponse,
  RosterTeam,
} from "../../shared/types/roster";

const { data: rosterData, status } = await useFetch<RosterResponse>(
  "/api/roster",
  {
    server: true,
  },
);

const viewMode = ref<"list" | "teams">("list");

const guild = computed(() => rosterData.value?.guild || null);
const players = computed<RosterPlayer[]>(() => rosterData.value?.players || []);
const teams = computed<RosterTeam[]>(() => rosterData.value?.teams || []);
const isLoading = computed(() => status.value === "pending");

const compareScoresDesc = (left: number | null, right: number | null) => {
  const leftHasScore = typeof left === "number";
  const rightHasScore = typeof right === "number";

  if (leftHasScore && rightHasScore) {
    return right - left;
  }

  if (leftHasScore) return -1;
  if (rightHasScore) return 1;
  return 0;
};

const getDisplayName = (player: RosterPlayer) => player.label || player.name;

const sortedPlayers = computed(() => {
  return [...players.value].sort((a, b) => {
    const scoreOrder = compareScoresDesc(
      a.mythic_plus_score,
      b.mythic_plus_score,
    );

    if (scoreOrder !== 0) {
      return scoreOrder;
    }

    return getDisplayName(a).localeCompare(getDisplayName(b));
  });
});

const sortedTeams = computed(() => {
  return [...teams.value].sort((a, b) => {
    const scoreOrder = compareScoresDesc(a.team_score, b.team_score);

    if (scoreOrder !== 0) {
      return scoreOrder;
    }

    return a.name.localeCompare(b.name);
  });
});

const getSortedTeamMembers = (team: RosterTeam) => {
  return [...team.members].sort((a, b) => {
    const scoreOrder = compareScoresDesc(
      a.mythic_plus_score,
      b.mythic_plus_score,
    );

    if (scoreOrder !== 0) {
      return scoreOrder;
    }

    return getDisplayName(a).localeCompare(getDisplayName(b));
  });
};

const hasPlayers = computed(() => sortedPlayers.value.length > 0);
const hasTeams = computed(() => sortedTeams.value.length > 0);

const raidProgressionArray = computed(() => {
  if (!guild.value?.raid_progression) return [];

  return Object.keys(guild.value.raid_progression).map((key) => ({
    name: key
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    summary: guild.value?.raid_progression?.[key]?.summary || "-",
  }));
});

const columns: TableColumn<RosterPlayer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "mythic_plus_best_runs",
    header: "Highest Scoring Runs",
  },
  {
    accessorKey: "mythic_plus_score",
    header: "M+ Score",
    cell: ({ row }) => {
      const score = row.getValue("mythic_plus_score") as number | null;
      return h("span", { class: getScoreColor(score) }, score ?? "-");
    },
  },
];

const getClassColor = (className: string) => {
  const colors: Record<string, string> = {
    "Death Knight": "text-[#C41F3B]",
    "Demon Hunter": "text-[#A330C9]",
    Druid: "text-[#FF7D0A]",
    Evoker: "text-[#33937F]",
    Hunter: "text-[#ABD473]",
    Mage: "text-[#69CCF0]",
    Monk: "text-[#00FF96]",
    Paladin: "text-[#F58CBA]",
    Priest: "dark:text-[#FFFFFF] text-[#000000]",
    Rogue: "text-warning dark:text-[#FFF569]",
    Shaman: "text-[#0070DE]",
    Warlock: "text-[#9482C9]",
    Warrior: "text-[#C79C6E]",
  };
  return colors[className] || "text-gray-500 dark:text-stone-400";
};

const getScoreColor = (score?: number | null) => {
  if (typeof score !== "number") return "text-gray-500 dark:text-stone-400";
  if (score >= 3000) return "text-orange-500";
  if (score >= 2500) return "text-purple-500";
  if (score >= 1500) return "text-blue-500";
  if (score >= 1000) return "text-green-500";
  if (score >= 500) return "text-yellow-500";
  return "text-gray-500 dark:text-stone-400";
};

const hasGuruTag = (name: string) => name.toLowerCase().includes("eir");
const getLookupStatusLabel = (player: RosterPlayer) =>
  player.lookup_status === "lookup_failed" ? "Lookup failed" : "No score yet";
const getRunKey = (run: RosterBestRun, index: number) =>
  run.id ?? `${run.short_name || "run"}-${run.mythic_level || 0}-${index}`;
</script>

<template>
  <div class="pt-32 pb-12 min-h-screen">
    <UContainer>
      <div
        class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h1
            class="mb-2 text-5xl font-heading font-black uppercase tracking-tight text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] [-webkit-text-stroke:2px_black] md:text-6xl"
          >
            Guild Roster
          </h1>
          <p
            class="mt-2 inline-block border-2 border-black bg-black px-4 py-2 text-xl font-body font-bold text-white shadow-[4px_4px_0px_0px_rgba(216,180,254,1)] -skew-x-6"
          >
            {{ guild?.name || "Exercise in Futility" }}
            <span class="px-2 font-black not-italic text-[#d8b4fe]">|</span>
            {{ guild?.realm || "Illidan" }} ({{
              (guild?.region || "us").toUpperCase()
            }})
          </p>
        </div>

        <div
          v-if="raidProgressionArray.length > 0"
          class="flex w-full flex-wrap gap-4 md:w-auto md:justify-end"
        >
          <div
            v-for="raid in raidProgressionArray"
            :key="raid.name"
            class="flex min-w-52 flex-1 flex-col items-center rounded-none border-4 border-black bg-secondary px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:min-w-0 md:flex-none"
          >
            <span
              class="mb-1 text-sm font-black uppercase tracking-widest text-white"
              >{{ raid.name }}</span
            >
            <span class="text-3xl font-heading font-black text-white">{{
              raid.summary
            }}</span>
          </div>
        </div>
      </div>

      <div class="mb-6 flex justify-start md:justify-end">
        <div
          class="inline-flex border-4 border-black bg-stone-950 p-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <button
            type="button"
            class="px-5 py-2 font-black uppercase tracking-[0.25em] transition-colors"
            :class="
              viewMode === 'list'
                ? 'bg-secondary text-white'
                : 'bg-transparent text-stone-300 hover:text-white'
            "
            @click="viewMode = 'list'"
          >
            List
          </button>
          <button
            type="button"
            class="px-5 py-2 font-black uppercase tracking-[0.25em] transition-colors"
            :class="
              viewMode === 'teams'
                ? 'bg-secondary text-white'
                : 'bg-transparent text-stone-300 hover:text-white'
            "
            @click="viewMode = 'teams'"
          >
            Teams
          </button>
        </div>
      </div>

      <div
        class="mt-8 overflow-hidden rounded-none border-4 border-black bg-stone-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <div class="p-1">
          <div
            v-if="isLoading"
            class="py-10 text-center text-xl font-black uppercase tracking-widest text-white"
          >
            Loading roster...
          </div>

          <div
            v-else-if="viewMode === 'list' && !hasPlayers"
            class="py-16 text-center"
          >
            <p
              class="text-xs font-black uppercase tracking-[0.35em] text-cyan-300"
            >
              Roster Empty
            </p>
            <p class="mt-3 text-lg font-bold text-stone-300">
              Add players to populate this view.
            </p>
          </div>

          <div
            v-else-if="viewMode === 'teams' && !hasTeams"
            class="py-16 text-center"
          >
            <p
              class="text-xs font-black uppercase tracking-[0.35em] text-cyan-300"
            >
              No Teams Yet
            </p>
            <p class="mt-3 text-lg font-bold text-stone-300">
              Add team definitions to group your roster.
            </p>
          </div>

          <template v-else-if="viewMode === 'list'">
            <div class="block md:hidden">
              <div v-for="player in sortedPlayers" :key="player.id" class="p-5">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-1">
                      <p
                        class="font-black text-xl uppercase tracking-tight text-white"
                      >
                        {{ getDisplayName(player) }}
                      </p>
                      <UPopover
                        v-if="hasGuruTag(player.name)"
                        :ui="{
                          content:
                            'bg-stone-800 border-2 border-black text-white shadow-[4px_4px_0_0_black] ring-0 rounded-none',
                        }"
                      >
                        <button
                          class="relative -top-px flex cursor-pointer items-center text-xl transition-transform hover:scale-110"
                          title="M+ Guru"
                        >
                          ✨
                        </button>
                        <template #content>
                          <div
                            class="px-3 py-2 text-sm font-black uppercase tracking-wider"
                          >
                            M+ Guru
                          </div>
                        </template>
                      </UPopover>
                    </div>
                    <p
                      :class="[
                        'text-xs font-bold uppercase tracking-wider',
                        getClassColor(player.class),
                      ]"
                    >
                      {{ player.class }}
                    </p>
                    <p
                      v-if="player.lookup_status !== 'ok'"
                      class="mt-2 text-xs font-black uppercase tracking-widest text-stone-400"
                    >
                      {{ getLookupStatusLabel(player) }}
                    </p>
                  </div>
                  <div
                    :class="[
                      'font-heading text-xl font-black',
                      getScoreColor(player.mythic_plus_score),
                    ]"
                  >
                    {{ player.mythic_plus_score ?? "-" }}
                  </div>
                </div>
                <div class="mt-4">
                  <div
                    v-if="player.mythic_plus_best_runs?.length"
                    class="flex flex-row items-center gap-2"
                  >
                    <div
                      v-for="(run, index) in player.mythic_plus_best_runs"
                      :key="getRunKey(run, index)"
                      class="group relative flex flex-col items-center"
                    >
                      <div class="relative">
                        <img
                          :src="run.background_image_url"
                          alt=""
                          class="h-10 w-10 rounded-none border-2 border-black object-cover brightness-75 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110"
                        />
                        <div
                          class="absolute inset-0 flex items-center justify-center"
                        >
                          <p
                            class="text-sm font-black text-white drop-shadow-md"
                          >
                            {{ run.mythic_level }}
                          </p>
                        </div>
                      </div>
                      <p
                        class="mt-1 text-[10px] font-black uppercase text-white"
                      >
                        {{ run.short_name }}
                      </p>
                    </div>
                  </div>
                  <span v-else class="font-black text-white/50">-</span>
                </div>
              </div>
            </div>

            <div class="hidden md:block">
              <UTable
                :data="sortedPlayers"
                :columns="columns"
                :loading="isLoading"
                :ui="{
                  th: 'font-heading font-black text-white uppercase tracking-widest text-xs py-5 border-b-4 border-black',
                  td: 'font-body font-bold py-4 text-white',
                  tbody: 'divide-y-4 divide-black',
                }"
              >
                <template #name-cell="{ row }">
                  <div class="flex items-center gap-4">
                    <UAvatar
                      :src="row.original.thumbnail_url || undefined"
                      size="lg"
                      :alt="`${getDisplayName(row.original)} avatar`"
                      class="rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    />
                    <div>
                      <div class="flex items-center gap-1">
                        <p
                          class="font-black text-xl uppercase tracking-tight text-white"
                        >
                          {{ getDisplayName(row.original) }}
                        </p>
                        <UPopover
                          v-if="hasGuruTag(row.original.name)"
                          :ui="{
                            content:
                              'bg-stone-800 border-2 border-black text-white shadow-[4px_4px_0_0_black] ring-0 rounded-none',
                          }"
                        >
                          <button
                            class="relative -top-px flex cursor-pointer items-center text-xl transition-transform hover:scale-110"
                            title="M+ Guru"
                          >
                            ✨
                          </button>
                          <template #content>
                            <div
                              class="px-3 py-2 text-sm font-black uppercase tracking-wider"
                            >
                              M+ Guru
                            </div>
                          </template>
                        </UPopover>
                      </div>
                      <p
                        :class="[
                          'text-xs font-bold uppercase tracking-wider',
                          getClassColor(row.original.class),
                        ]"
                      >
                        {{ row.original.class }}
                      </p>
                      <p
                        v-if="row.original.lookup_status !== 'ok'"
                        class="mt-2 text-xs font-black uppercase tracking-widest text-stone-400"
                      >
                        {{ getLookupStatusLabel(row.original) }}
                      </p>
                    </div>
                  </div>
                </template>

                <template #mythic_plus_best_runs-cell="{ row }">
                  <div
                    v-if="row.original.mythic_plus_best_runs?.length"
                    class="flex flex-row items-center gap-2"
                  >
                    <div
                      v-for="(run, index) in row.original.mythic_plus_best_runs"
                      :key="getRunKey(run, index)"
                      class="group relative flex flex-col items-center"
                    >
                      <div class="relative">
                        <img
                          :src="run.background_image_url"
                          alt=""
                          class="h-10 w-10 rounded-none border-2 border-black object-cover brightness-75 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110"
                        />
                        <div
                          class="absolute inset-0 flex items-center justify-center"
                        >
                          <p
                            class="text-sm font-black text-white drop-shadow-md"
                          >
                            {{ run.mythic_level }}
                          </p>
                        </div>
                      </div>
                      <p
                        class="mt-1 text-[10px] font-black uppercase text-white"
                      >
                        {{ run.short_name }}
                      </p>
                    </div>
                  </div>
                  <span v-else class="font-black text-white/50">-</span>
                </template>

                <template #mythic_plus_score-cell="{ row }">
                  <div
                    :class="[
                      'font-heading text-xl font-black',
                      getScoreColor(
                        row.getValue('mythic_plus_score') as number | null,
                      ),
                    ]"
                  >
                    {{
                      (row.getValue("mythic_plus_score") as number | null) ??
                      "-"
                    }}
                  </div>
                </template>
              </UTable>
            </div>
          </template>

          <template v-else>
            <div class="grid gap-6 p-6 md:grid-cols-2">
              <section
                v-for="team in sortedTeams"
                :key="team.id"
                class="border-4 border-black bg-stone-950 p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p
                      class="text-xs font-black uppercase tracking-[0.35em] text-cyan-300"
                    >
                      Team
                    </p>
                    <h2
                      class="mt-2 text-2xl font-heading font-black uppercase text-white"
                    >
                      {{ team.name }}
                    </h2>
                    <p
                      class="mt-2 text-sm font-black uppercase tracking-wider text-stone-400"
                    >
                      {{ team.total_member_count }} players,
                      {{ team.scored_member_count }} scored
                    </p>
                  </div>
                  <div class="text-right">
                    <p
                      class="text-xs font-black uppercase tracking-[0.35em] text-stone-400"
                    >
                      Avg
                    </p>
                    <p
                      :class="[
                        'mt-2 font-heading text-4xl font-black',
                        getScoreColor(team.team_score),
                      ]"
                    >
                      {{ team.team_score ?? "-" }}
                    </p>
                  </div>
                </div>

                <div class="mt-5 space-y-3">
                  <div
                    v-for="player in getSortedTeamMembers(team)"
                    :key="`${team.id}-${player.id}`"
                    class="flex items-center justify-between gap-4 border-2 border-black bg-stone-900 px-4 py-3"
                  >
                    <div class="flex min-w-0 items-center gap-3">
                      <UAvatar
                        :src="player.thumbnail_url || undefined"
                        size="md"
                        :alt="`${getDisplayName(player)} avatar`"
                        class="rounded-none border-2 border-black"
                      />
                      <div class="min-w-0">
                        <div class="flex items-center gap-1">
                          <p
                            class="truncate font-black uppercase tracking-tight text-white"
                          >
                            {{ getDisplayName(player) }}
                          </p>
                          <span
                            v-if="hasGuruTag(player.name)"
                            class="text-sm"
                            aria-hidden="true"
                          >
                            ✨
                          </span>
                        </div>
                        <p
                          :class="[
                            'text-xs font-bold uppercase tracking-wider',
                            getClassColor(player.class),
                          ]"
                        >
                          {{ player.class }}
                        </p>
                        <p
                          v-if="player.lookup_status !== 'ok'"
                          class="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-400"
                        >
                          {{ getLookupStatusLabel(player) }}
                        </p>
                      </div>
                    </div>

                    <div
                      :class="[
                        'text-right font-heading text-2xl font-black',
                        getScoreColor(player.mythic_plus_score),
                      ]"
                    >
                      {{ player.mythic_plus_score ?? "-" }}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </template>
        </div>
      </div>

      <div
        class="mt-4 text-right font-mono text-sm font-bold uppercase tracking-wider text-gray-400"
      >
        Data powered by
        <a
          href="https://raider.io/"
          target="_blank"
          class="text-orange-500 hover:text-orange-400 hover:underline"
          >Raider.io</a
        >
      </div>
    </UContainer>
  </div>
</template>
