<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stars = ref<{ id: number; top: string; left: string; delay: string; size: string }[]>([])

onMounted(() => {
  stars.value = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${(Math.random() * 3).toFixed(1)}s`,
    size: ['w-1 h-1', 'w-1.5 h-1.5', 'w-2 h-2'][Math.floor(Math.random() * 3)],
  }))
})

const features = [
  { icon: 'i-lucide-heart', title: 'Unmatched Friendliness', desc: 'A toxicity-free environment where veterans and new players alike find a warm welcome.', bg: 'bg-paladin-pink', border: 'border-paladin-pink' },
  { icon: 'i-lucide-trophy', title: 'AOTC Raiding', desc: 'Consistent Heroic clears on a relaxed 2-night schedule.', bg: 'bg-rogue-yellow', border: 'border-rogue-yellow' },
  { icon: 'i-lucide-swords', title: 'M+ Groups', desc: 'Daily keys ranging from KSM to high push levels.', bg: 'bg-mage-blue', border: 'border-mage-blue' },
  { icon: 'i-lucide-video', title: 'Weekly Streams', desc: 'Catch weekly raid recaps, highlights, and chill hangouts.', bg: 'bg-loot-purple', border: 'border-loot-purple' },
  { icon: 'i-lucide-cat', title: 'We Love Cats', desc: '50% strategy, 50% cat photos. It\'s basically a requirement.', bg: 'bg-druid-orange', border: 'border-druid-orange' },
]

const dpsList = [
  { name: 'IceCreamCone', dps: '1.2M', percent: 100, color: 'bg-mage-blue' },
  { name: 'Qbeans', dps: '1.1M', percent: 92, color: 'bg-rogue-yellow' },
  { name: 'BobbyIsOnFire', dps: '780k', percent: 85, color: 'bg-monk-green' },
]
</script>

<template>
  <div class="relative min-h-screen bg-gray-950 text-white overflow-hidden">
    <!-- Scanline overlay -->
    <div class="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
         style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px);" />

    <!-- Pixel grid background -->
    <div class="absolute inset-0 opacity-[0.08]"
         style="background-image: linear-gradient(rgba(105,204,240,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(105,204,240,0.3) 1px, transparent 1px); background-size: 32px 32px;" />

    <!-- Twinkling stars -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <span
        v-for="star in stars"
        :key="star.id"
        class="absolute rounded-full bg-white animate-pulse"
        :class="star.size"
        :style="{ top: star.top, left: star.left, animationDelay: star.delay }"
      />
    </div>

    <!-- Hero Section -->
    <div class="relative z-10 pt-48 md:pt-56 pb-20">
      <UContainer class="text-center space-y-10 max-w-5xl">
        <!-- Pixelated badge -->
        <div class="inline-block">
          <div class="bg-mage-blue/20 border-2 border-mage-blue px-6 py-2 font-mono text-mage-blue text-sm tracking-widest uppercase"
               style="clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);">
            &gt;&gt; US-Illidan &lt;&lt;
          </div>
        </div>

        <h1 class="font-heading font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-[0.85]">
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-paladin-pink via-rogue-yellow to-mage-blue">
            The Friendliest
          </span>
          <span class="block mt-2">Guild on Illidan</span>
        </h1>

        <p class="text-lg md:text-xl text-gray-400 font-body max-w-2xl mx-auto leading-relaxed font-mono">
          We're a fun, friendly, and inclusive World of Warcraft guild.
          Our diverse group of friends has been adventuring together for years, and we're always excited to welcome new members.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            class="group relative px-10 py-4 bg-paladin-pink text-gray-900 font-heading font-black text-lg uppercase tracking-wider border-2 border-paladin-pink hover:bg-paladin-pink/80 transition-colors"
            style="clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);"
            @click="useJoinModal().open()"
          >
            <UIcon name="i-simple-icons-discord" class="w-5 h-5 inline mr-2" />
            Join Discord
          </button>
          <NuxtLink
            to="/streams"
            class="px-10 py-4 border-2 border-mage-blue text-mage-blue font-heading font-black text-lg uppercase tracking-wider hover:bg-mage-blue/10 transition-colors"
            style="clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);"
          >
            Watch Streams
            <UIcon name="i-heroicons-play-circle-solid" class="w-5 h-5 inline ml-2" />
          </NuxtLink>
        </div>

        <!-- Retro DPS Meter -->
        <div class="max-w-sm mx-auto mt-16 border-2 border-mage-blue/50 bg-gray-900/80 p-6"
             style="clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px);">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-mono font-bold text-mage-blue text-sm uppercase tracking-wider">// Top DPS</h3>
            <span class="text-xs font-mono text-gray-500 border border-gray-700 px-2 py-0.5">Nerub-ar</span>
          </div>
          <div class="space-y-3">
            <div v-for="(player, i) in dpsList" :key="i" class="flex items-center gap-3">
              <span class="font-mono text-xs w-4 text-gray-500">{{ i + 1 }}.</span>
              <div class="flex-1">
                <div class="flex justify-between text-sm font-mono">
                  <span class="font-bold">{{ player.name }}</span>
                  <span class="text-gray-500">{{ player.dps }}</span>
                </div>
                <div class="h-2 bg-gray-800 mt-1 overflow-hidden border border-gray-700">
                  <div class="h-full" :class="player.color" :style="{ width: player.percent + '%' }" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Features Section -->
    <div class="relative z-10 py-20 md:py-32">
      <UContainer class="max-w-5xl space-y-16">
        <div class="text-center space-y-3">
          <h2 class="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-rogue-yellow to-druid-orange">Select Your Class</span>
          </h2>
          <p class="text-gray-500 font-mono text-sm">&gt; More than just a guild, we're a family_</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group border-2 p-6 bg-gray-900/60 hover:bg-gray-900/90 transition-all duration-300 hover:-translate-y-1"
            :class="feature.border"
            style="clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px);"
          >
            <div class="w-12 h-12 flex items-center justify-center mb-4 border-2" :class="[feature.border, feature.bg + '/20']">
              <UIcon :name="feature.icon" class="w-6 h-6" :class="'text-' + feature.bg.replace('bg-', '')" />
            </div>
            <h3 class="font-heading font-black text-xl uppercase mb-2">{{ feature.title }}</h3>
            <p class="text-gray-400 font-mono text-sm leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- News Section -->
    <div class="relative z-10 pb-20">
      <UContainer class="max-w-5xl">
        <LandingNewsFeed
          heading-class="text-mage-blue"
          description-class="text-gray-400 font-mono"
          card-class="bg-gray-900/70 border border-mage-blue/30"
        />
      </UContainer>
    </div>

    <!-- Back link -->
    <div class="relative z-10 pb-20 text-center">
      <NuxtLink to="/landing-pages" class="font-mono text-mage-blue hover:text-mage-blue/70 text-sm transition-colors">
        &lt;-- Back to Landing Page Lab
      </NuxtLink>
    </div>
  </div>
</template>
