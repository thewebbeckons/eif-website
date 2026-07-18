<script setup lang="ts">
import type { HallOfFameContent } from "../../shared/types/hall-of-fame";

const { data, error, status, refresh } = await useFetch<HallOfFameContent>(
  "/api/hall-of-fame",
  { server: true },
);

const isLoading = computed(() => status.value === "pending");
const hasError = computed(() => status.value === "error");

useSeoMeta({
  title: () => data.value?.title || "Hall of Fame",
  description: () =>
    data.value?.introduction ||
    "Exercise in Futility's season-by-season Mythic+ champions.",
});
</script>

<template>
  <div class="min-h-screen pb-24 pt-32">
    <UContainer>
      <header class="mb-16 max-w-4xl">
        <p
          class="mb-4 font-mono text-xs font-black uppercase tracking-[0.4em] text-cyan-300"
        >
          Exercise in Futility archives
        </p>
        <h1
          class="text-5xl font-heading font-black uppercase tracking-tight text-white drop-shadow-[4px_4px_0_#000] [-webkit-text-stroke:2px_black] md:text-7xl"
        >
          {{ data?.title || "Hall of Fame" }}
        </h1>
        <p
          class="mt-5 inline-block -skew-x-3 border-2 border-black bg-black px-4 py-2 text-lg font-body font-bold text-white shadow-[4px_4px_0_0_#d8b4fe] md:text-xl"
        >
          {{
            data?.introduction ||
            "Immortalizing our champion Mythic+ squads across the seasons."
          }}
        </p>
      </header>

      <div v-if="isLoading" class="py-20 text-center" aria-live="polite">
        <UIcon
          name="i-lucide-loader-circle"
          class="mx-auto size-12 animate-spin text-purple-300"
        />
        <p class="mt-4 font-black uppercase tracking-widest text-white">
          Opening the archives…
        </p>
      </div>

      <section
        v-else-if="hasError"
        class="border-4 border-black bg-stone-900 p-10 text-center shadow-[8px_8px_0_0_#000]"
      >
        <p
          class="text-xs font-black uppercase tracking-[0.35em] text-rose-400"
        >
          Archive retrieval failed
        </p>
        <p class="mt-3 text-lg font-bold text-stone-200">
          {{ error?.message || "The Hall of Fame is temporarily locked." }}
        </p>
        <UButton
          class="mt-6"
          color="neutral"
          icon="i-lucide-refresh-cw"
          label="Try again"
          @click="refresh()"
        />
      </section>

      <div v-else class="space-y-12">
        <section
          v-if="data?.activeSeason"
          class="relative overflow-hidden border-4 border-black bg-stone-900 p-6 shadow-[8px_8px_0_0_#000] md:p-8"
        >
          <div
            class="absolute -right-20 -top-20 size-64 rounded-full bg-purple-500/15 blur-3xl"
          />
          <div
            class="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between"
          >
            <div class="max-w-3xl">
              <p
                class="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-purple-300"
              >
                <span class="relative flex size-3">
                  <span
                    class="absolute inline-flex size-full animate-ping rounded-full bg-purple-400 opacity-75"
                  />
                  <span
                    class="relative inline-flex size-3 rounded-full bg-purple-500"
                  />
                </span>
                Active season
              </p>
              <h2
                class="mt-3 text-3xl font-heading font-black uppercase text-white md:text-5xl"
              >
                {{ data.activeSeason.name }}
              </h2>
              <p
                class="mt-4 text-base font-medium leading-relaxed text-stone-300 md:text-lg"
              >
                {{ data.activeSeason.description }}
              </p>
            </div>

            <UButton
              to="/roster"
              size="xl"
              color="neutral"
              class="self-start border-4 border-black bg-purple-400 font-heading font-black uppercase tracking-widest text-black shadow-[4px_4px_0_0_#000] hover:bg-purple-300 md:self-center"
              trailing-icon="i-lucide-arrow-up-right"
            >
              Live standings
            </UButton>
          </div>
        </section>

        <div class="flex items-center gap-4 py-4">
          <div class="h-1 grow bg-black" />
          <span
            class="font-heading text-xl font-black uppercase tracking-widest text-white md:text-2xl"
          >
            Hall of champions
          </span>
          <div class="h-1 grow bg-black" />
        </div>

        <div v-if="data?.seasons.length" class="space-y-12">
          <HallOfFameSeasonCard
            v-for="(season, index) in data.seasons"
            :key="season.id"
            :season="season"
            :index="index"
          />
        </div>

        <section
          v-else
          class="border-4 border-dashed border-stone-600 bg-stone-900/80 p-12 text-center"
        >
          <UIcon name="i-lucide-trophy" class="mx-auto size-12 text-stone-500" />
          <p class="mt-4 font-black uppercase tracking-widest text-stone-300">
            The first champions have yet to be crowned.
          </p>
        </section>
      </div>
    </UContainer>
  </div>
</template>
