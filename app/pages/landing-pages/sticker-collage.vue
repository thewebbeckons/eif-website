<script setup lang="ts">
const features = [
  { icon: 'i-lucide-heart', title: 'Unmatched Friendliness', desc: 'A toxicity-free environment where veterans and new players alike find a warm welcome.', bg: 'bg-pink-200 dark:bg-pink-900/50', rotate: '-rotate-2', tape: 'right-2 -top-3 rotate-12' },
  { icon: 'i-lucide-trophy', title: 'AOTC Raiding', desc: 'Consistent Heroic clears on a relaxed 2-night schedule.', bg: 'bg-yellow-200 dark:bg-yellow-900/50', rotate: 'rotate-1', tape: 'left-4 -top-3 -rotate-6' },
  { icon: 'i-lucide-swords', title: 'M+ Groups', desc: 'Daily keys ranging from KSM to high push levels.', bg: 'bg-blue-200 dark:bg-blue-900/50', rotate: '-rotate-1', tape: 'right-6 -top-3 rotate-3' },
  { icon: 'i-lucide-video', title: 'Weekly Streams', desc: 'Catch weekly raid recaps, highlights, and chill hangouts.', bg: 'bg-purple-200 dark:bg-purple-900/50', rotate: 'rotate-2', tape: 'left-2 -top-3 -rotate-12' },
  { icon: 'i-lucide-cat', title: 'We Love Cats', desc: '50% strategy, 50% cat photos. It\'s basically a requirement.', bg: 'bg-orange-200 dark:bg-orange-900/50', rotate: '-rotate-3', tape: 'right-4 -top-3 rotate-6' },
]

const dpsList = [
  { name: 'IceCreamCone', dps: '1.2M', percent: 100, color: 'bg-mage-blue' },
  { name: 'Qbeans', dps: '1.1M', percent: 92, color: 'bg-rogue-yellow' },
  { name: 'BobbyIsOnFire', dps: '780k', percent: 85, color: 'bg-monk-green' },
]

const stickers = [
  { emoji: '⚔️', top: '15%', left: '5%', rotate: '-12deg', size: 'text-4xl md:text-6xl' },
  { emoji: '🐱', top: '25%', right: '8%', rotate: '15deg', size: 'text-5xl md:text-7xl' },
  { emoji: '🛡️', top: '55%', left: '3%', rotate: '8deg', size: 'text-3xl md:text-5xl' },
  { emoji: '✨', top: '45%', right: '5%', rotate: '-20deg', size: 'text-4xl md:text-6xl' },
  { emoji: '🎮', top: '75%', left: '8%', rotate: '25deg', size: 'text-3xl md:text-5xl' },
  { emoji: '💜', top: '70%', right: '10%', rotate: '-8deg', size: 'text-4xl md:text-5xl' },
]
</script>

<template>
  <div class="relative min-h-screen bg-amber-50 dark:bg-stone-950 overflow-hidden">
    <!-- Notebook lines background -->
    <div class="absolute inset-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none"
         style="background-image: repeating-linear-gradient(transparent, transparent 31px, #60a5fa 31px, #60a5fa 32px); background-size: 100% 32px;" />

    <!-- Grid dot pattern -->
    <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none"
         style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 20px 20px;" />

    <!-- Floating stickers -->
    <div class="hidden md:block">
      <span
        v-for="(sticker, i) in stickers"
        :key="i"
        class="absolute opacity-20 dark:opacity-10 pointer-events-none select-none drop-shadow-lg"
        :class="sticker.size"
        :style="{
          top: sticker.top,
          left: sticker.left,
          right: sticker.right,
          transform: `rotate(${sticker.rotate})`,
        }"
      >{{ sticker.emoji }}</span>
    </div>

    <!-- Hero Section -->
    <div class="relative z-10 pt-48 md:pt-56 pb-20">
      <UContainer class="max-w-5xl">
        <div class="text-center space-y-10">
          <!-- Sticker-style badge -->
          <div class="inline-block">
            <div class="bg-mage-blue/30 dark:bg-mage-blue/20 border-3 border-dashed border-mage-blue rounded-full px-8 py-3 font-heading font-black text-sm uppercase tracking-widest text-gray-700 dark:text-stone-300 transform -rotate-2">
              US-Illidan Server
            </div>
          </div>

          <!-- Headline with tape/sticker styling -->
          <div class="relative inline-block">
            <h1 class="font-heading font-black text-6xl md:text-8xl uppercase tracking-tight leading-[0.9] text-gray-900 dark:text-stone-100">
              The
              <span class="relative inline-block mx-2">
                <span class="relative z-10 bg-rogue-yellow/50 dark:bg-rogue-yellow/30 px-4 py-1 -rotate-1 inline-block border-2 border-dashed border-gray-900/20 dark:border-stone-400/20">Friendliest</span>
              </span>
              <br/>
              <span class="inline-block mt-2">Guild on</span>
              <span class="relative inline-block ml-3">
                <span class="relative z-10 bg-paladin-pink/50 dark:bg-paladin-pink/30 px-4 py-1 rotate-1 inline-block border-2 border-dashed border-gray-900/20 dark:border-stone-400/20">Illidan.</span>
              </span>
            </h1>
          </div>

          <p class="text-lg md:text-xl text-gray-600 dark:text-stone-400 font-body max-w-2xl mx-auto leading-relaxed">
            We're a fun, friendly, and inclusive World of Warcraft guild on the US-Illidan server!
            Our diverse group of friends has been adventuring together for years, and we're always excited to welcome new members.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              class="relative px-8 py-4 bg-paladin-pink dark:bg-paladin-pink/80 text-gray-900 dark:text-stone-100 font-heading font-black text-base uppercase rounded-2xl border-3 border-gray-900 dark:border-stone-400 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform -rotate-1 hover:rotate-0 flex items-center gap-2"
              @click="useJoinModal().open()"
            >
              <UIcon name="i-simple-icons-discord" class="w-5 h-5" />
              Join Discord
              <!-- Tape decoration -->
              <span class="absolute -top-2 right-4 w-16 h-5 bg-yellow-200/80 dark:bg-yellow-300/50 rotate-12 border border-yellow-300/50" />
            </button>
            <NuxtLink
              to="/streams"
              class="px-8 py-4 bg-white dark:bg-stone-900 text-gray-900 dark:text-stone-100 font-heading font-black text-base uppercase rounded-2xl border-3 border-gray-900 dark:border-stone-400 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 transform rotate-1 hover:rotate-0 flex items-center gap-2"
            >
              Watch Streams
              <UIcon name="i-heroicons-play-circle-solid" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>

        <!-- Polaroid-style DPS Card -->
        <div class="max-w-sm mx-auto mt-16 transform rotate-2 hover:rotate-0 transition-transform duration-500">
          <div class="bg-white dark:bg-stone-900 rounded-lg border-3 border-gray-900 dark:border-stone-400 p-4 pb-8 shadow-lg">
            <div class="bg-gray-100 dark:bg-stone-800 rounded p-4 border border-gray-200 dark:border-stone-700">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-heading font-bold text-lg text-gray-900 dark:text-stone-100">Top DPS</h3>
                <span class="text-xs font-mono bg-gray-200 dark:bg-stone-700 rounded-full px-2 py-0.5 text-gray-500 dark:text-stone-400">Nerub-ar</span>
              </div>
              <div class="space-y-3">
                <div v-for="(player, i) in dpsList" :key="i" class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-full border-2 border-black dark:border-stone-400 flex items-center justify-center text-white text-xs font-bold" :class="player.color">
                    {{ i + 1 }}
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between text-sm font-medium">
                      <span class="font-bold text-gray-900 dark:text-stone-100">{{ player.name }}</span>
                      <span class="font-mono text-gray-500 dark:text-stone-400">{{ player.dps }}</span>
                    </div>
                    <div class="h-2 bg-gray-200 dark:bg-stone-700 rounded-full mt-1 overflow-hidden">
                      <div class="h-full rounded-full" :class="player.color" :style="{ width: player.percent + '%' }" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p class="text-center font-heading font-bold text-sm text-gray-500 dark:text-stone-400 mt-4 uppercase tracking-wider">Raid Night Memories</p>
          </div>
          <!-- Tape on top -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-200/80 dark:bg-yellow-300/50 border border-yellow-300/50 rotate-1" />
        </div>
      </UContainer>
    </div>

    <!-- Features Section -->
    <div class="relative z-10 py-20 md:py-32">
      <UContainer class="max-w-5xl space-y-16">
        <div class="text-center space-y-3">
          <h2 class="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight text-gray-900 dark:text-stone-100">
            What Makes Us
            <span class="relative inline-block transform -rotate-1">
              <span class="relative z-10 bg-monk-green/40 dark:bg-monk-green/20 px-3 py-1 border-2 border-dashed border-gray-900/20 dark:border-stone-400/20">Unique</span>
            </span>
          </h2>
          <p class="text-gray-500 dark:text-stone-400 font-medium text-lg">More than just a guild, we're a family</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group relative rounded-2xl border-3 border-gray-900 dark:border-stone-400 p-6 shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            :class="[feature.bg, feature.rotate, 'hover:rotate-0']"
          >
            <!-- Tape decoration -->
            <span class="absolute w-16 h-5 bg-yellow-200/70 dark:bg-yellow-300/40 border border-yellow-300/40" :class="feature.tape" />

            <div class="w-12 h-12 rounded-xl border-2 border-gray-900 dark:border-stone-400 bg-white dark:bg-stone-800 flex items-center justify-center mb-4 shadow-sm">
              <UIcon :name="feature.icon" class="w-6 h-6 text-gray-900 dark:text-stone-100" />
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
          card-class="bg-white/85 dark:bg-stone-900/80 border-2 border-gray-900/15 dark:border-stone-500/40 rounded-2xl shadow-sm"
        />
      </UContainer>
    </div>

    <!-- Back link -->
    <div class="relative z-10 pb-20 text-center">
      <NuxtLink to="/landing-pages" class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-stone-900 border-3 border-gray-900 dark:border-stone-400 rounded-full font-heading font-bold text-sm text-gray-700 dark:text-stone-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all transform -rotate-1 hover:rotate-0">
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Landing Page Lab
      </NuxtLink>
    </div>
  </div>
</template>
