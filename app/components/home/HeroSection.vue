<script setup lang="ts">
import HeroMeteors from '~/components/home/HeroMeteors.vue'
import RaidDashboard from '~/components/home/RaidDashboard.vue'

// Explicit imports ensure no auto-import ambiguity
</script>
<template>
  <div class="relative bg-amber-50 dark:bg-stone-950 min-h-screen flex flex-col items-center">
    <HeroMeteors />

    <!-- Notebook lines background -->
    <div class="absolute inset-0 opacity-[0.1] dark:opacity-[0.06] pointer-events-none"
         style="background-image: repeating-linear-gradient(transparent, transparent 31px, #60a5fa 31px, #60a5fa 32px); background-size: 100% 32px;" />

    <!-- Subtle dot pattern overlay -->
    <!-- <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none"
         style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 20px 20px;" /> -->

    <!-- Main Content Container -->
    <UContainer class="relative z-10 w-full max-w-6xl mx-auto px-4 pt-48 md:pt-56 lg:pt-64 flex flex-col items-center text-center">

      <!-- Top Section: Headline -->
      <div class="relative w-full flex flex-col items-center justify-center mb-20">

        <!-- Center Text -->
        <div class="max-w-3xl space-y-8 z-10">
          <h1 class="text-6xl md:text-8xl font-heading font-black text-gray-900 dark:text-stone-100 tracking-tight leading-[0.9]">
            The <span class="relative inline-block">
              <span class="relative z-10">Friendliest</span>
              <span class="absolute -bottom-1 left-0 right-0 h-5 md:h-7 bg-rogue-yellow/60 dark:bg-rogue-yellow/40 -rotate-1 rounded-sm" />
            </span>
            <br/>Guild on Illidan.
          </h1>
          <p class="text-lg md:text-xl text-gray-700/80 dark:text-stone-300 font-body px-4 leading-relaxed max-w-2xl mx-auto">
            We're a fun, friendly, and inclusive World of Warcraft guild on the US-Illidan server!
            Our diverse group of friends has been adventuring together for years, and we're always excited to welcome new members.
            Whether you're a seasoned raider or just looking for a chill group to hang out with, come be part of our adventure!
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <UButton
              size="xl"
              color="neutral"
              variant="solid"
              class="px-8 py-4 font-bold text-base"
              @click="useJoinModal().open()"
              label="Join Discord"
            >
              <template #leading>
                 <UIcon name="i-simple-icons-discord" class="w-5 h-5" />
              </template>
            </UButton>
            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              to="/streams"
              class="px-8 py-4 font-bold text-base bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm"
              label="Watch Streams"
            >
              <template #trailing>
                <UIcon name="i-heroicons-play-circle-solid" class="w-5 h-5" />
              </template>
            </UButton>
          </div>
        </div>
      </div>

      <!-- Bottom Reveal: Dashboard Mockup -->
      <div class="w-full relative -mb-24 md:-mb-32 z-20 pointer-events-none select-none scale-90 md:scale-100">
        <RaidDashboard />
      </div>

    </UContainer>
  </div>
</template>
