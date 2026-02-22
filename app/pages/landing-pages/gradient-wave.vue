<script setup lang="ts">
const features = [
  { icon: 'i-lucide-heart', title: 'Unmatched Friendliness', desc: 'A toxicity-free environment where veterans and new players alike find a warm welcome and supportive family.' },
  { icon: 'i-lucide-trophy', title: 'AOTC Raiding', desc: 'Consistent Heroic clears on a relaxed 2-night schedule.' },
  { icon: 'i-lucide-swords', title: 'M+ Groups', desc: 'Daily keys ranging from KSM to high push levels.' },
  { icon: 'i-lucide-video', title: 'Weekly Streams', desc: 'Catch weekly raid recaps, highlights, and chill hangouts.' },
  { icon: 'i-lucide-cat', title: 'We Love Cats', desc: '50% strategy, 50% cat photos. It\'s basically a requirement.' },
]

const dpsList = [
  { name: 'IceCreamCone', dps: '1.2M', percent: 100, color: 'from-cyan-400 to-blue-500' },
  { name: 'Qbeans', dps: '1.1M', percent: 92, color: 'from-yellow-400 to-orange-500' },
  { name: 'BobbyIsOnFire', dps: '780k', percent: 85, color: 'from-green-400 to-emerald-500' },
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950">
    <!-- Top gradient wave -->
    <div class="absolute top-0 left-0 right-0 h-[80vh]">
      <div class="absolute inset-0 bg-gradient-to-br from-paladin-pink via-loot-purple to-mage-blue dark:from-paladin-pink/60 dark:via-loot-purple/60 dark:to-mage-blue/60" />
      <!-- Wave SVG bottom -->
      <svg class="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="height: 120px;">
        <path d="M0 80C360 160 720 0 1080 80C1260 120 1380 100 1440 80V200H0V80Z" class="fill-white dark:fill-gray-950" />
      </svg>
    </div>

    <!-- Floating gradient blobs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 right-10 w-64 h-64 bg-rogue-yellow/30 rounded-full blur-3xl animate-float" />
      <div class="absolute top-40 left-20 w-48 h-48 bg-monk-green/20 rounded-full blur-3xl animate-float" style="animation-delay: -3s" />
    </div>

    <!-- Hero Section -->
    <div class="relative z-10 pt-48 md:pt-56 pb-20">
      <UContainer class="max-w-5xl">
        <div class="text-center space-y-10">
          <!-- Pill badge -->
          <div class="inline-block">
            <div class="bg-white/25 backdrop-blur-sm border border-white/40 rounded-full px-6 py-2 text-sm font-bold text-white shadow-lg">
              US-Illidan Server
            </div>
          </div>

          <h1 class="font-heading font-black text-6xl md:text-8xl uppercase tracking-tight leading-[0.9] text-white drop-shadow-sm">
            The Friendliest
            <br/>
            <span class="text-white/90">Guild on Illidan.</span>
          </h1>

          <p class="text-lg md:text-xl text-white/80 font-body max-w-2xl mx-auto leading-relaxed">
            We're a fun, friendly, and inclusive World of Warcraft guild on the US-Illidan server!
            Our diverse group of friends has been adventuring together for years, and we're always excited to welcome new members.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              class="px-8 py-4 bg-white text-gray-900 font-heading font-bold text-base rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              @click="useJoinModal().open()"
            >
              <UIcon name="i-simple-icons-discord" class="w-5 h-5" />
              Join Discord
            </button>
            <NuxtLink
              to="/streams"
              class="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-heading font-bold text-base rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
            >
              Watch Streams
              <UIcon name="i-heroicons-play-circle-solid" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>

        <!-- Gradient DPS card -->
        <div class="max-w-md mx-auto mt-16 relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-paladin-pink via-loot-purple to-mage-blue rounded-3xl blur-sm opacity-50" />
          <div class="relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl">
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-heading font-bold text-lg text-gray-900 dark:text-white">Top DPS</h3>
              <span class="text-xs font-mono bg-gradient-to-r from-paladin-pink/20 to-loot-purple/20 rounded-full px-3 py-1 text-gray-500 dark:text-gray-400">Nerub-ar</span>
            </div>
            <div class="space-y-4">
              <div v-for="(player, i) in dpsList" :key="i" class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shadow-md" :class="player.color">
                  {{ i + 1 }}
                </div>
                <div class="flex-1">
                  <div class="flex justify-between text-sm font-medium">
                    <span class="font-bold text-gray-800 dark:text-white">{{ player.name }}</span>
                    <span class="font-mono text-gray-400">{{ player.dps }}</span>
                  </div>
                  <div class="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r" :class="player.color" :style="{ width: player.percent + '%' }" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Floating loot -->
          <div class="absolute -right-4 -top-6 bg-white dark:bg-gray-900 rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-float border border-gray-100 dark:border-gray-800" style="animation-delay: -2s">
            <div class="w-10 h-10 bg-gradient-to-br from-loot-purple to-violet-600 rounded-xl flex items-center justify-center text-white">
              <UIcon name="i-heroicons-star" class="w-6 h-6" />
            </div>
            <div>
              <div class="text-xs text-gray-400 font-bold uppercase tracking-wider">Loot Drop</div>
              <div class="text-sm font-black bg-gradient-to-r from-loot-purple to-violet-600 bg-clip-text text-transparent">Void-Touched Helm</div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Middle gradient wave section -->
    <div class="relative py-20 md:py-32">
      <!-- Decorative wave -->
      <div class="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="height: 60px; width: 100%;">
          <path d="M0 100C480 0 960 100 1440 0V0H0V100Z" class="fill-gradient-to-r from-paladin-pink/10 to-mage-blue/10" fill="url(#wave-gradient)" />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#F58CBA" stop-opacity="0.1" />
              <stop offset="50%" stop-color="#A335EE" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#69CCF0" stop-opacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <UContainer class="max-w-5xl space-y-16 relative z-10">
        <div class="text-center space-y-3">
          <h2 class="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight text-gray-900 dark:text-white">
            What Makes Us
            <span class="bg-gradient-to-r from-paladin-pink via-loot-purple to-mage-blue bg-clip-text text-transparent">Unique</span>
          </h2>
          <p class="text-gray-500 dark:text-gray-400 font-medium text-lg">More than just a guild, we're a family</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(feature, i) in features"
            :key="feature.title"
            class="group relative rounded-3xl p-6 bg-gray-50 dark:bg-gray-900 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <!-- Gradient border effect -->
            <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-paladin-pink/20 via-loot-purple/20 to-mage-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="absolute inset-px rounded-3xl bg-gray-50 dark:bg-gray-900" />

            <div class="relative z-10">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-paladin-pink via-loot-purple to-mage-blue flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UIcon :name="feature.icon" class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-heading font-black text-xl uppercase mb-2 text-gray-900 dark:text-white">{{ feature.title }}</h3>
              <p class="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- News Section -->
    <div class="relative z-10 pb-20">
      <UContainer class="max-w-5xl">
        <LandingNewsFeed
          heading-class="text-gray-900 dark:text-white"
          description-class="text-gray-500 dark:text-gray-400"
          card-class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm"
        />
      </UContainer>
    </div>

    <!-- Back link -->
    <div class="relative z-10 pb-20 text-center">
      <NuxtLink to="/landing-pages" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-paladin-pink to-loot-purple rounded-full font-bold text-sm text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Landing Page Lab
      </NuxtLink>
    </div>
  </div>
</template>
