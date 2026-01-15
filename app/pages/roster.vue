<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'

const { data: guild, status } = await useFetch<any>('https://raider.io/api/v1/guilds/profile', {
  query: {
    region: 'us',
    realm: 'illidan',
    name: 'exercise in futility',
    fields: 'members,raid_progression'
  }
})

interface Member {
  name: string
  race: string
  class: string
  thumbnail_url?: string
  mythic_plus_score?: number
  mythic_plus_best_runs?: any
}

const members = ref<Member[]>([])
const loadingScores = ref(false)

watch(guild, async (newGuild) => {
  if (!newGuild?.members) {
    members.value = []
    return
  }

  const filteredMembers = newGuild.members
    .filter((m: any) => m.rank < 5)
    .map((m: any) => ({
      name: m.character.name,
      race: m.character.race,
      class: m.character.class,
      mythic_plus_score: 0 // Placeholder
    }))

  members.value = filteredMembers
  loadingScores.value = true

  // Fetch Mythic+ scores in parallel
  const scorePromises = filteredMembers.map(async (member: Member) => {
    try {
      const { data } = await useFetch<any>('https://raider.io/api/v1/characters/profile', {
        query: {
          region: 'us',
          realm: 'illidan',
          name: member.name,
          fields: 'mythic_plus_scores_by_season:current,mythic_plus_best_runs'
        },
        key: `mp-score-${member.name}` // Unique key for caching
      })

      if (data.value?.mythic_plus_scores_by_season?.[0]?.scores?.all) {
        member.mythic_plus_score = Math.round(data.value.mythic_plus_scores_by_season[0].scores.all)
        member.mythic_plus_best_runs = data.value.mythic_plus_best_runs
        member.thumbnail_url = data.value.thumbnail_url
      }
    } catch (e) {
      console.error(`Failed to fetch score for ${member.name}`, e)
    }
  })

  await Promise.all(scorePromises)

  // Filter out members with 0 score
  members.value = members.value.filter(m => (m.mythic_plus_score || 0) > 0)

  loadingScores.value = false
}, { immediate: true })

const sortedMembers = computed(() => {
  return [...members.value].sort((a, b) => {
    if (a.mythic_plus_score && b.mythic_plus_score) {
      return b.mythic_plus_score - a.mythic_plus_score
    }
    return 0
  })
})

const raidProgression = computed(() => {
  if (!guild.value?.raid_progression) return null
  // Specifically targeting Nerub-ar Palace as per plan
  return guild.value.raid_progression['manaforge-omega']
})

const columns: TableColumn<Member>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'mythic_plus_best_runs',
    header: 'Highest Scoring Runs'
  },
  {
    accessorKey: 'mythic_plus_score',
    header: 'M+ Score',
    cell: ({ row }) => {
      const score = row.getValue('mythic_plus_score') as number
      const color = getScoreColor(score)
      return h('span', { class: color }, score || '-')
    }
  }
]

const getClassColor = (className: string) => {
  const colors: Record<string, string> = {
    'Death Knight': 'text-[#C41F3B]',
    'Demon Hunter': 'text-[#A330C9]',
    'Druid': 'text-[#FF7D0A]',
    'Evoker': 'text-[#33937F]',
    'Hunter': 'text-[#ABD473]',
    'Mage': 'text-[#69CCF0]',
    'Monk': 'text-[#00FF96]',
    'Paladin': 'text-[#F58CBA]',
    'Priest': 'dark:text-[#FFFFFF] text-[#000000]',
    'Rogue': 'text-warning dark:text-[#FFF569]',
    'Shaman': 'text-[#0070DE]',
    'Warlock': 'text-[#9482C9]',
    'Warrior': 'text-[#C79C6E]'
  }
  return colors[className] || 'text-gray-500 dark:text-stone-400'
}

const getScoreColor = (score?: number) => {
  if (!score) return 'text-gray-500 dark:text-stone-400'
  if (score >= 3000) return 'text-orange-500'
  if (score >= 2500) return 'text-purple-500'
  if (score >= 1500) return 'text-blue-500'
  if (score >= 1000) return 'text-green-500'
  if (score >= 500) return 'text-yellow-500'
  return 'text-gray-500 dark:text-stone-400'
}

const hasGuruTag = (name: string) => name.toLowerCase().includes('eir')

</script>

<template>
  <div class="pt-32 pb-12 min-h-screen bg-stone-50/50 dark:bg-stone-950">
    <UContainer>
      <div class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 class="text-5xl md:text-6xl font-heading font-black text-gray-900 dark:text-stone-100 tracking-tight mb-2 drop-shadow-sm">
            Guild Roster
          </h1>
          <p class="text-xl font-body text-gray-600 dark:text-stone-400 italic">
            Exercise in Futility <span class="text-gray-400 dark:text-stone-500 not-italic px-2">|</span> Illidan (US)
          </p>
        </div>

        <div v-if="raidProgression" 
             class="bg-white dark:bg-stone-900 border-2 border-gray-900 dark:border-stone-700 shadow-search rounded-xl px-6 py-4 flex flex-col items-center transform transition hover:-translate-y-1 hover:shadow-lg duration-200">
          <span class="text-xs font-bold text-gray-500 dark:text-stone-400 uppercase tracking-widest mb-1">Manaforge Omega</span>
          <span class="text-2xl font-heading font-black text-primary">{{ raidProgression.summary }}</span>
        </div>
      </div>

      <div class="bg-white dark:bg-stone-900 border-2 border-gray-900 dark:border-stone-700 shadow-lg rounded-3xl overflow-hidden">
        <div class="p-1"> <!-- Inner padding for border separation if needed, or just let table fill -->
          <div class="block md:hidden">
            <div v-if="status === 'pending' || loadingScores" class="py-10 text-center text-gray-500 dark:text-stone-400 font-medium">
              Loading roster...
            </div>
            <div v-else class="divide-y-2 divide-gray-100 dark:divide-stone-800">
              <div v-for="member in sortedMembers" :key="member.name" class="p-5">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <UTooltip v-if="hasGuruTag(member.name)" text="M+ Guru">
                      <p class="font-bold text-lg text-gray-900 dark:text-stone-100">
                        {{ member.name }}
                      </p>
                    </UTooltip>
                    <p v-else class="font-bold text-lg text-gray-900 dark:text-stone-100">
                      {{ member.name }}
                    </p>
                    <p :class="['text-xs font-bold uppercase tracking-wider', getClassColor(member.class)]">
                      {{ member.class }}
                    </p>
                  </div>
                  <div :class="['font-heading font-black text-xl', getScoreColor(member.mythic_plus_score)]">
                    {{ member.mythic_plus_score || '-' }}
                  </div>
                </div>
                <div class="mt-4">
                  <div v-if="member.mythic_plus_best_runs" class="flex flex-row gap-2 items-center">
                    <div v-for="run in member.mythic_plus_best_runs" :key="run.id"
                      class="flex flex-col items-center relative group">
                      <div class="relative">
                        <img 
                          :src="run.background_image_url" 
                          alt=""
                          class="object-cover h-10 w-10 brightness-75 border-2 border-gray-900 dark:border-stone-700 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110" 
                        />
                        <div class="absolute inset-0 flex items-center justify-center">
                           <p class="text-white font-black text-sm drop-shadow-md">{{ run.mythic_level }}</p>
                        </div>
                      </div>
                      <p class="text-gray-500 dark:text-stone-400 font-bold text-[10px] mt-1">{{ run.short_name }}</p>
                    </div>
                  </div>
                  <span v-else class="text-gray-400 dark:text-stone-500 font-medium">-</span>
                </div>
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <UTable 
              :data="sortedMembers" 
              :columns="columns" 
              :loading="status === 'pending' || loadingScores"
              :ui="{
                th: 'font-heading font-bold text-gray-900 dark:text-stone-100 uppercase tracking-widest text-xs py-5',
                td: 'font-body py-4 text-gray-900 dark:text-stone-100',
                tbody: 'divide-y-2 divide-gray-100 dark:divide-stone-800'
              }"
            >
              <template #name-cell="{ row }">
                <div class="flex items-center gap-4">
                  <UAvatar 
                    :src="row.original.thumbnail_url" 
                    size="lg" 
                    :alt="`${row.original.name} avatar`"
                    class="ring-2 ring-gray-900 dark:ring-stone-700 ring-offset-2"
                  />
                  <div>
                    <UTooltip v-if="hasGuruTag(row.original.name)" text="M+ Guru">
                      <p class="font-bold text-lg text-gray-900 dark:text-stone-100">
                        {{ row.original.name }}
                      </p>
                    </UTooltip>
                    <p v-else class="font-bold text-lg text-gray-900 dark:text-stone-100">
                      {{ row.original.name }}
                    </p>
                    <p :class="['text-xs font-bold uppercase tracking-wider', getClassColor(row.original.class)]">
                      {{ row.original.class }}
                    </p>
                  </div>
                </div>
              </template>
              <template #mythic_plus_best_runs-cell="{ row }">
                <div v-if="row.original.mythic_plus_best_runs" class="flex flex-row gap-2 items-center">
                  <div v-for="run in row.original.mythic_plus_best_runs" :key="run.id"
                    class="flex flex-col items-center relative group">
                    <div class="relative">
                      <img 
                        :src="run.background_image_url" 
                        alt=""
                        class="object-cover h-10 w-10 brightness-75 border-2 border-gray-900 dark:border-stone-700 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110" 
                      />
                      <div class="absolute inset-0 flex items-center justify-center">
                         <p class="text-white font-black text-sm drop-shadow-md">{{ run.mythic_level }}</p>
                      </div>
                    </div>
                    <p class="text-gray-500 dark:text-stone-400 font-bold text-[10px] mt-1">{{ run.short_name }}</p>
                  </div>
                </div>
                <span v-else class="text-gray-400 dark:text-stone-500 font-medium">-</span>
              </template>
              <template #mythic_plus_score-cell="{ row }">
                 <div :class="['font-heading font-black text-xl', getScoreColor(row.getValue('mythic_plus_score'))]">
                   {{ row.getValue('mythic_plus_score') || '-' }}
                 </div>
              </template>
            </UTable>
          </div>
        </div>
      </div>

    </UContainer>
  </div>
</template>