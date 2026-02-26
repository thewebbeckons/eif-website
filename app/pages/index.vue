<script setup lang="ts">
const { client } = usePrismic();

const { data: home } = await useAsyncData("home", () =>
  client.getSingle("home"),
);
</script>

<template>
  <div
    class="min-h-screen font-body text-white selection:bg-purple-500 selection:text-white"
  >
    <div class="relative z-10 pointer-events-none">
      <main class="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <HomeHero :description="home?.data.description ?? undefined" />
        <HomeFeatures />
        <HomeVibes />
        <HomeRecruitmentRoles :roles="home?.data.roles" />
      </main>
    </div>
  </div>
</template>
