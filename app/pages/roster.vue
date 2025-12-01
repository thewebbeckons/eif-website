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
  return colors[className] || 'text-gray-500'
}

const getScoreColor = (score?: number) => {
  if (!score) return 'text-gray-500'
  if (score >= 3000) return 'text-orange-500'
  if (score >= 2500) return 'text-purple-500'
  if (score >= 1500) return 'text-blue-500'
  if (score >= 1000) return 'text-green-500'
  if (score >= 500) return 'text-yellow-500'
  return 'text-gray-500'
}
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold mb-2">Guild Roster</h1>
        <p class="text-gray-500 dark:text-gray-400">
          Exercise in Futility - Illidan (US)
        </p>
      </div>

      <UPageCard v-if="raidProgression" variant="subtle" color="primary" spotlight class="w-full md:w-auto">
        <div class="flex flex-col items-center px-4 py-2">
          <span class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manaforge
            Omega</span>
          <span class="text-2xl font-bold text-primary">{{ raidProgression.summary }}</span>
        </div>
      </UPageCard>
    </div>

    <UCard variant="subtle" color="primary">
      <UTable :data="sortedMembers" :columns="columns" :loading="status === 'pending' || loadingScores">
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :src="row.original.thumbnail_url" size="lg" :alt="`${row.original.name} avatar`" />
            <div>
              <p class="font-medium text-highlighted">
                {{ row.original.name }}
              </p>
              <p :class="getClassColor(row.original.class)">
                {{ row.original.class }}
              </p>
            </div>
          </div>
        </template>
        <template #mythic_plus_best_runs-cell="{ row }">
          <div v-if="row.original.mythic_plus_best_runs" class="flex flex-row gap-2 items-center">
            <div v-for="run in row.original.mythic_plus_best_runs" :key="run.id"
              class="flex flex-col items-center relative">
              <!-- <UAvatar class="rounded-md border-1 border-neutral grayscale" :src="run.background_image_url" size="lg"
                :alt="`${row.original.name} avatar`" /> -->
              <div class="flex flex-col items-center">
                <img :src="run.background_image_url" alt=""
                  class="object-cover h-10 w-10 brightness-70 border border-gray-500 rounded-sm" />
                <p class=" absolute text-white font-bold">{{ run.mythic_level }}</p>
                <p class="absolute text-neutral-300 font-medium bottom-0 text-[10px]">{{ run.short_name }}</p>
              </div>
            </div>
          </div>
          <span v-else>-</span>
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>