<script setup lang="ts">
const features = [
  { icon: 'i-lucide-heart', title: 'Unmatched Friendliness', desc: 'A toxicity-free environment where veterans and new players alike find a warm welcome and supportive family.', gradient: 'from-pink-400 to-rose-500' },
  { icon: 'i-lucide-trophy', title: 'AOTC Raiding', desc: 'Consistent Heroic clears on a relaxed 2-night schedule.', gradient: 'from-amber-400 to-orange-500' },
  { icon: 'i-lucide-swords', title: 'M+ Groups', desc: 'Daily keys ranging from KSM to high push levels.', gradient: 'from-sky-400 to-blue-500' },
  { icon: 'i-lucide-video', title: 'Weekly Streams', desc: 'Catch weekly raid recaps, highlights, and chill hangouts.', gradient: 'from-violet-400 to-purple-500' },
  { icon: 'i-lucide-cat', title: 'We Love Cats', desc: '50% strategy, 50% cat photos. It\'s basically a requirement.', gradient: 'from-orange-400 to-red-500' },
]

const dpsList = [
  { name: 'IceCreamCone', dps: '1.2M', percent: 100, color: 'from-mage-blue to-sky-400' },
  { name: 'Qbeans', dps: '1.1M', percent: 92, color: 'from-rogue-yellow to-amber-400' },
  { name: 'BobbyIsOnFire', dps: '780k', percent: 85, color: 'from-monk-green to-emerald-400' },
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Animated gradient background -->
    <div class="fixed inset-0 bg-gradient-to-br from-pink-300 via-purple-300 via-40% to-sky-300 dark:from-pink-950 dark:via-purple-950 dark:to-sky-950" />

    <!-- Large floating orbs -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-paladin-pink/40 dark:bg-paladin-pink/20 rounded-full blur-3xl animate-float" />
      <div class="absolute top-1/3 -right-32 w-80 h-80 bg-mage-blue/40 dark:bg-mage-blue/20 rounded-full blur-3xl animate-float" style="animation-delay: -2s" />
      <div class="absolute -bottom-32 left-1/3 w-96 h-96 bg-loot-purple/30 dark:bg-loot-purple/15 rounded-full blur-3xl animate-float" style="animation-delay: -4s" />
      <div class="absolute top-2/3 left-1/4 w-64 h-64 bg-rogue-yellow/30 dark:bg-rogue-yellow/15 rounded-full blur-3xl animate-float" style="animation-delay: -3s" />
    </div>

    <!-- Hero Section -->
    <div class="relative z-10 pt-48 md:pt-56 pb-20">
      <UContainer class="max-w-5xl">
        <div class="text-center space-y-10">
          <!-- Glass badge -->
          <div class="inline-block">
            <div class="bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/15 rounded-full px-6 py-2 text-sm font-bold text-gray-800 dark:text-white/90 shadow-lg">
              US-Illidan Server
            </div>
          </div>

          <h1 class="font-heading font-black text-6xl md:text-8xl uppercase tracking-tight leading-[0.9] text-gray-900 dark:text-white">
            The <span class="relative inline-block">
              <span class="relative z-10">Friendliest</span>
              <span class="absolute -bottom-1 left-0 right-0 h-5 md:h-7 bg-white/40 dark:bg-white/20 backdrop-blur-sm -rotate-1 rounded-sm" />
            </span>
            <br/>Guild on Illidan.
          </h1>

          <p class="text-lg md:text-xl text-gray-700/90 dark:text-white/70 font-body max-w-2xl mx-auto leading-relaxed">
            We're a fun, friendly, and inclusive World of Warcraft guild on the US-Illidan server!
            Our diverse group of friends has been adventuring together for years, and we're always excited to welcome new members.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              class="px-8 py-4 bg-white/30 dark:bg-white/15 backdrop-blur-xl border border-white/40 dark:border-white/25 rounded-2xl font-heading font-bold text-base text-gray-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/25 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
              @click="useJoinModal().open()"
            >
              <UIcon name="i-simple-icons-discord" class="w-5 h-5" />
              Join Discord
            </button>
            <NuxtLink
              to="/streams"
              class="px-8 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl font-heading font-bold text-base text-gray-800 dark:text-white/80 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
            >
              Watch Streams
              <UIcon name="i-heroicons-play-circle-solid" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>

        <!-- Glass DPS Card -->
        <div class="max-w-sm mx-auto mt-16">
          <div class="bg-white/25 dark:bg-white/10 backdrop-blur-2xl border border-white/30 dark:border-white/15 rounded-3xl p-6 shadow-2xl">
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-heading font-bold text-lg text-gray-900 dark:text-white">Top DPS</h3>
              <span class="text-xs font-mono bg-white/30 dark:bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-gray-600 dark:text-white/60">Nerub-ar</span>
            </div>
            <div class="space-y-4">
              <div v-for="(player, i) in dpsList" :key="i" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shadow-md" :class="player.color">
                  {{ i + 1 }}
                </div>
                <div class="flex-1">
                  <div class="flex justify-between text-sm font-medium">
                    <span class="font-bold text-gray-800 dark:text-white">{{ player.name }}</span>
                    <span class="font-mono text-gray-500 dark:text-white/50">{{ player.dps }}</span>
                  </div>
                  <div class="h-2.5 bg-white/20 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r" :class="player.color" :style="{ width: player.percent + '%' }" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Floating loot toast -->
          <div class="relative -mt-4 ml-auto w-fit mr-4">
            <div class="bg-white/30 dark:bg-white/10 backdrop-blur-2xl border border-white/40 dark:border-white/20 rounded-2xl p-3 shadow-xl flex items-center gap-3 animate-float" style="animation-delay: -2s">
              <div class="w-10 h-10 bg-gradient-to-br from-loot-purple to-violet-500 rounded-xl flex items-center justify-center text-white shadow-md">
                <UIcon name="i-heroicons-star" class="w-6 h-6" />
              </div>
              <div>
                <div class="text-xs text-gray-500 dark:text-white/50 font-bold uppercase tracking-wider">Loot Drop</div>
                <div class="text-sm font-black text-loot-purple dark:text-violet-300">Void-Touched Helm</div>
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
          <h2 class="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight text-gray-900 dark:text-white">
            What Makes Us <span class="relative inline-block"><span class="relative z-10">Unique</span><span class="absolute -bottom-1 left-0 right-0 h-4 md:h-5 bg-white/40 dark:bg-white/20 backdrop-blur-sm rotate-[-0.5deg] rounded-sm" /></span>
          </h2>
          <p class="text-gray-600 dark:text-white/60 font-medium text-lg">More than just a guild, we're a family</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group bg-white/20 dark:bg-white/8 backdrop-blur-xl border border-white/30 dark:border-white/15 rounded-3xl p-6 hover:bg-white/35 dark:hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg" :class="feature.gradient">
              <UIcon :name="feature.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="font-heading font-black text-xl uppercase mb-2 text-gray-900 dark:text-white">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-white/60 font-medium text-sm leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- News Section -->
    <div class="relative z-10 pb-20">
      <UContainer class="max-w-5xl">
        <LandingNewsFeed
          heading-class="text-gray-900 dark:text-white"
          description-class="text-gray-700/80 dark:text-white/60"
          card-class="bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/15"
        />
      </UContainer>
    </div>

    <!-- Back link -->
    <div class="relative z-10 pb-20 text-center">
      <NuxtLink to="/landing-pages" class="bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/15 rounded-full px-6 py-3 font-bold text-gray-700 dark:text-white/80 hover:bg-white/30 dark:hover:bg-white/20 transition-all text-sm inline-flex items-center gap-2">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Landing Page Lab
      </NuxtLink>
    </div>
  </div>
</template>
