<script lang="ts" setup>
// create a reactive ref to store the current page
const page = ref(1);

// create a asyncdata function to fetch guild roster from blizzard api
const getRoster = async () => {
  const response = await fetch(
    `https://us.api.blizzard.com/data/wow/guild/illidan/exerciseinfutility/roster?namespace=profile-us&locale=en_US&access_token=${process.env.BLIZZARD_API_KEY}`
  );
  const data = await response.json();
  return data;
};
const roster = [
  {
    name: "Malisona",
    race: "Tauren",
    class: "Druid",
    level: 70,
    role: "Tank",
    rank: "Guild Leader",
  },
  {
    name: "Eirymi",
    race: "Dracthyr",
    class: "Evoker",
    level: 70,
    role: "DPS",
    rank: "Rank 4",
  },
  {
    name: "Nightgrissly",
    race: "Blood Elf",
    class: "Death Knight",
    level: 70,
    role: "Tank",
    rank: "Rank 4",
  },
  {
    name: "Samhulk",
    race: "Mag'har Orc",
    class: "Warrior",
    level: 70,
    role: "DPS",
    rank: "Rank 4",
  },
  {
    name: "Lasood",
    race: "Night Elf",
    class: "Druid",
    level: 70,
    role: "Healer",
    rank: "Rank 6",
  },
  {
    name: "Coffeestains",
    race: "Void Elf",
    class: "Hunter",
    level: 70,
    role: "DPS",
    rank: "Rank 6",
  },
];
</script>
<template>
  <UContainer class="py-24 sm:py-32 md:py-40 relative space-y-8 md:space-y-12">
    <section class="flex flex-col">
      <div>
        <h1
          class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-3 leading-tight flex flex-row items-center space-x-2"
        >
          <UIcon name="i-heroicons-user" />
          <span class="text-slate-700">455</span>
          <span class="text-primary">Members</span>
        </h1>
        <p class="font-light tracking-wide text-slate-600">Founded 2016</p>
      </div>
    </section>
    <section>
      <UTable :rows="roster" />
    </section>
  </UContainer>
</template>
