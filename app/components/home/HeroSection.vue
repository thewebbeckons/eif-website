<script setup lang="ts">
import HeroMeteors from '~/components/home/HeroMeteors.vue'
import RaidDashboard from '~/components/home/RaidDashboard.vue'

// Explicit imports ensure no auto-import ambiguity
</script>
<template>
  <div class="relative overflow-hidden bg-white min-h-screen flex flex-col items-center">
    <HeroMeteors />

    <!-- Main Content Container -->
    <UContainer class="relative z-10 w-full max-w-6xl mx-auto px-4 pt-48 md:pt-56 lg:pt-64 flex flex-col items-center text-center">
      
      <!-- Top Section: Headline (No Mascots) -->
      <div class="relative w-full flex flex-col items-center justify-center mb-20">
        
        <!-- Center Text -->
        <div class="max-w-3xl space-y-8 z-10">
          <h1 class="text-6xl md:text-8xl font-heading font-bold text-gray-900 tracking-tight leading-[0.9]">
            The <span class="text-paladin-pink relative inline-block">
              Friendliest
              <svg class="absolute -bottom-2 w-full h-3 text-druid-orange/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor"/></svg>
            </span> 
            <br/>Guild on Illidan.
          </h1>
          <p class="text-lg md:text-xl text-gray-500 font-body px-4 leading-relaxed">
            We’re a fun, friendly, and inclusive World of Warcraft guild on the US-Illidan server! 
            Our diverse group of friends has been adventuring together for years, and we’re always excited to welcome new members. 
            Whether you're a seasoned raider or just looking for a chill group to hang out with, come be part of our adventure!
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <UButton 
              size="xl" 
              class="rounded-full px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-transform hover:scale-105"
              @click="useJoinModal().open()"
              label="Join Discord"
            >
              <template #leading>
                 <UIcon name="i-simple-icons-discord" class="w-5 h-5" />
              </template>
            </UButton>
            <UButton 
              size="xl" 
              class="rounded-full px-8 py-4 bg-white text-gray-900 border border-gray-200 shadow-lg hover:shadow-xl transition-all"
              variant="ghost"
              to="/streams"
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
      <div class="w-full relative -mb-32 md:-mb-24 z-0 pointer-events-none select-none opacity-80 scale-90 md:scale-100">
        <RaidDashboard />
      </div>

    </UContainer>
  </div>
</template>
