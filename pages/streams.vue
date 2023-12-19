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
</script>
<template>
  <UContainer class="py-24 sm:py-32 md:py-40 relative">
    <section
      class="mx-auto px-4 sm:px-6 lg:px-8 gap-16 sm:gap-y-24 max-w-4xl flex flex-col text-center"
    >
      <div>
        <h1
          class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl mb-3"
        >
          Let's watch some streams!
        </h1>
      </div>
    </section>
  </UContainer>
</template>
