<script setup lang="ts">
import { ref, onMounted } from 'vue'

const bubbles = ref<{ id: number; size: string; left: string; delay: string; duration: string; color: string }[]>([])

onMounted(() => {
  const colors = ['bg-paladin-pink/30', 'bg-mage-blue/30', 'bg-rogue-yellow/30', 'bg-monk-green/30', 'bg-loot-purple/30', 'bg-druid-orange/30']
  bubbles.value = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: `${Math.floor(Math.random() * 80) + 20}px`,
    left: `${Math.random() * 100}%`,
    delay: `${(Math.random() * 8).toFixed(1)}s`,
    duration: `${Math.floor(Math.random() * 6) + 6}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))
})

const features = [
  { icon: 'i-lucide-heart', title: 'Unmatched Friendliness', desc: 'A toxicity-free environment where veterans and new players alike find a warm welcome.', bg: 'bg-pink-100 dark:bg-pink-950/40', iconBg: 'bg-paladin-pink', shadow: 'shadow-paladin-pink/30' },
  { icon: 'i-lucide-trophy', title: 'AOTC Raiding', desc: 'Consistent Heroic clears on a relaxed 2-night schedule.', bg: 'bg-amber-100 dark:bg-amber-950/40', iconBg: 'bg-rogue-yellow', shadow: 'shadow-rogue-yellow/30' },
  { icon: 'i-lucide-swords', title: 'M+ Groups', desc: 'Daily keys ranging from KSM to high push levels.', bg: 'bg-sky-100 dark:bg-sky-950/40', iconBg: 'bg-mage-blue', shadow: 'shadow-mage-blue/30' },
  { icon: 'i-lucide-video', title: 'Weekly Streams', desc: 'Catch weekly raid recaps, highlights, and chill hangouts.', bg: 'bg-violet-100 dark:bg-violet-950/40', iconBg: 'bg-loot-purple', shadow: 'shadow-loot-purple/30' },
  { icon: 'i-lucide-cat', title: 'We Love Cats', desc: '50% strategy, 50% cat photos. It\'s basically a requirement.', bg: 'bg-orange-100 dark:bg-orange-950/40', iconBg: 'bg-druid-orange', shadow: 'shadow-druid-orange/30' },
]

const dpsList = [
  { name: 'IceCreamCone', dps: '1.2M', percent: 100, color: 'bg-mage-blue' },
  { name: 'Qbeans', dps: '1.1M', percent: 92, color: 'bg-rogue-yellow' },
  { name: 'BobbyIsOnFire', dps: '780k', percent: 85, color: 'bg-monk-green' },
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden" style="background: linear-gradient(135deg, #FFF0F5 0%, #FFF8E1 25%, #F0F8FF 50%, #F5FFF0 75%, #FFF0FA 100%);">
    <!-- Dark mode background override -->
    <div class="absolute inset-0 bg-stone-950 dark:block hidden" />

    <!-- Rising bubbles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-for="bubble in bubbles"
        :key="bubble.id"
        class="absolute rounded-full animate-float"
        :class="bubble.color"
        :style="{
          width: bubble.size,
          height: bubble.size,
          left: bubble.left,
          bottom: '-10%',
          animationDelay: bubble.delay,
          animationDuration: bubble.duration,
        }"
      />
    </div>

    <!-- Dotted pattern -->
    <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none"
         style="background-image: radial-gradient(circle, #000 1.5px, transparent 1.5px); background-size: 28px 28px;" />

    <!-- Hero Section -->
    <div class="relative z-10 pt-48 md:pt-56 pb-20">
      <UContainer class="max-w-5xl">
        <div class="text-center space-y-10">
          <!-- Bouncy badge -->
          <div class="inline-block animate-float" style="animation-duration: 3s">
            <div class="bg-white dark:bg-stone-900 border-3 border-gray-900 dark:border-stone-400 rounded-full px-8 py-3 font-heading font-black text-sm uppercase tracking-wider text-gray-700 dark:text-stone-300 shadow-md">
              <span class="inline-block animate-bounce" style="animation-duration: 2s">🎮</span>
              US-Illidan Server
              <span class="inline-block animate-bounce" style="animation-duration: 2s; animation-delay: 0.3s">✨</span>
            </div>
          </div>

          <h1 class="font-heading font-black text-6xl md:text-8xl uppercase tracking-tight leading-[0.9] text-gray-900 dark:text-stone-100">
            The
            <span class="relative inline-block">
              <span class="relative z-10 text-transparent bg-clip-text" style="background: linear-gradient(135deg, #F58CBA, #A335EE, #69CCF0); -webkit-background-clip: text;">Friendliest</span>
            </span>
            <br/>
            Guild on
            <span class="relative inline-block">
              <span class="relative z-10">Illidan</span>
              <span class="absolute -bottom-2 left-0 right-0 h-4 md:h-6 bg-rogue-yellow/60 dark:bg-rogue-yellow/30 rounded-full" />
            </span>
            <span class="text-paladin-pink">.</span>
          </h1>

          <p class="text-lg md:text-xl text-gray-600 dark:text-stone-400 font-body max-w-2xl mx-auto leading-relaxed">
            We're a fun, friendly, and inclusive World of Warcraft guild on the US-Illidan server!
            Our diverse group of friends has been adventuring together for years, and we're always excited to welcome new members.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <button
              class="group px-10 py-5 bg-paladin-pink text-gray-900 font-heading font-black text-lg uppercase rounded-full border-3 border-gray-900 dark:border-stone-400 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center gap-3"
              @click="useJoinModal().open()"
            >
              <UIcon name="i-simple-icons-discord" class="w-6 h-6 group-hover:animate-bounce" />
              Join Discord
            </button>
            <NuxtLink
              to="/streams"
              class="group px-10 py-5 bg-mage-blue/20 dark:bg-mage-blue/10 text-gray-900 dark:text-stone-100 font-heading font-black text-lg uppercase rounded-full border-3 border-gray-900 dark:border-stone-400 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              Watch Streams
              <UIcon name="i-heroicons-play-circle-solid" class="w-6 h-6 group-hover:animate-bounce" />
            </NuxtLink>
          </div>
        </div>

        <!-- Candy DPS Card -->
        <div class="max-w-sm mx-auto mt-16">
          <div class="bg-white dark:bg-stone-900 rounded-[2rem] border-3 border-gray-900 dark:border-stone-400 p-6 shadow-xl">
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-heading font-bold text-lg text-gray-900 dark:text-stone-100">
                <span class="mr-1">🏆</span> Top DPS
              </h3>
              <span class="text-xs font-heading font-bold bg-loot-purple/20 text-loot-purple dark:text-violet-300 rounded-full px-3 py-1">Nerub-ar</span>
            </div>
            <div class="space-y-4">
              <div v-for="(player, i) in dpsList" :key="i" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full border-3 border-gray-900 dark:border-stone-400 flex items-center justify-center text-white text-sm font-black" :class="player.color">
                  {{ i + 1 }}
                </div>
                <div class="flex-1">
                  <div class="flex justify-between text-sm font-medium">
                    <span class="font-bold text-gray-900 dark:text-stone-100">{{ player.name }}</span>
                    <span class="font-mono text-gray-400 dark:text-stone-500">{{ player.dps }}</span>
                  </div>
                  <div class="h-3 bg-gray-100 dark:bg-stone-800 rounded-full mt-1 overflow-hidden border-2 border-gray-900/10 dark:border-stone-600">
                    <div class="h-full rounded-full" :class="player.color" :style="{ width: player.percent + '%' }" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Floating loot -->
          <div class="relative -mt-2 ml-auto w-fit mr-0">
            <div class="bg-white dark:bg-stone-900 rounded-full border-3 border-gray-900 dark:border-stone-400 py-2 px-4 shadow-lg flex items-center gap-2 animate-float" style="animation-delay: -1s; animation-duration: 4s">
              <span class="text-lg">💎</span>
              <span class="font-heading font-black text-sm text-loot-purple dark:text-violet-300">Void-Touched Helm</span>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Features Section -->
    <div class="relative z-10 py-20 md:py-32">
      <UContainer class="max-w-5xl space-y-16">
        <div class="text-center space-y-3">
          <h2 class="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight text-gray-900 dark:text-stone-100">
            What Makes Us
            <span class="relative inline-block">
              <span class="relative z-10">Unique</span>
              <span class="absolute -bottom-2 left-0 right-0 h-4 md:h-6 bg-monk-green/40 dark:bg-monk-green/20 rounded-full" />
            </span>
            <span class="inline-block animate-bounce text-3xl ml-2" style="animation-duration: 2s">💖</span>
          </h2>
          <p class="text-gray-500 dark:text-stone-400 font-medium text-lg">More than just a guild, we're a family</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group rounded-[2rem] border-3 border-gray-900 dark:border-stone-400 p-6 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-xl"
            :class="feature.bg"
          >
            <div class="w-14 h-14 rounded-2xl border-3 border-gray-900 dark:border-stone-400 flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" :class="feature.iconBg">
              <UIcon :name="feature.icon" class="w-7 h-7 text-white" />
            </div>
            <h3 class="font-heading font-black text-xl uppercase mb-2 text-gray-900 dark:text-stone-100">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-stone-400 font-medium text-sm leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- News Section -->
    <div class="relative z-10 pb-20">
      <UContainer class="max-w-5xl">
        <LandingNewsFeed
          heading-class="text-gray-900 dark:text-stone-100"
          description-class="text-gray-500 dark:text-stone-400"
          card-class="bg-white dark:bg-stone-900 border-2 border-gray-900/20 dark:border-stone-500/50 rounded-[1.5rem] shadow-md"
        />
      </UContainer>
    </div>

    <!-- Back link -->
    <div class="relative z-10 pb-20 text-center">
      <NuxtLink to="/landing-pages" class="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-stone-900 border-3 border-gray-900 dark:border-stone-400 rounded-full font-heading font-black text-sm uppercase text-gray-700 dark:text-stone-300 shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-105 transition-all">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Lab
      </NuxtLink>
    </div>
  </div>
</template>
