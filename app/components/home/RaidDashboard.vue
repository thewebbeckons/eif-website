<template>
  <div class="relative w-full max-w-sm mx-auto perspective-1000 pt-12 px-4 md:pt-16 md:px-0">
    <!-- Main Card (Damage Meter) -->
    <div class="bg-white dark:bg-stone-900 rounded-3xl border-2 border-black dark:border-stone-300 p-6 shadow-lg transform rotate-x-12 translate-y-10 opacity-90 hover:opacity-100 hover:transform-none transition-all duration-500 text-gray-900 dark:text-stone-100">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-heading font-bold text-lg">Top DPS</h3>
            <span class="text-xs font-mono bg-gray-100 dark:bg-stone-800 border border-black/10 dark:border-stone-600 rounded-full px-2 py-0.5 text-gray-500 dark:text-stone-400">Nerub-ar</span>
      </div>

      <div class="space-y-3">
        <div v-for="(player, i) in dpsList" :key="i" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-white text-xs font-bold" :class="player.color">
            {{ i + 1 }}
          </div>
          <div class="flex-1">
            <div class="flex justify-between text-sm font-medium">
              <span class="font-bold">{{ player.name }}</span>
              <span class="font-mono text-gray-500 dark:text-stone-400">{{ player.dps }}</span>
            </div>
            <div class="h-2 bg-gray-100 dark:bg-stone-700 rounded-full mt-1 overflow-hidden border border-black/5">
              <div class="h-full rounded-full" :class="player.color" :style="{ width: player.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Loot Toast -->
    <div class="absolute right-0 top-0 md:-right-4 md:-top-4 bg-white dark:bg-stone-900 rounded-2xl border-2 border-black dark:border-stone-300 p-3 shadow-md flex items-center gap-3 animate-float" style="animation-delay: -2s">
      <div class="w-10 h-10 bg-loot-purple rounded-xl border-2 border-black flex items-center justify-center text-white">
        <UIcon name="i-heroicons-star" class="w-6 h-6" />
      </div>
      <div>
        <div class="text-xs text-gray-400 dark:text-stone-400 font-bold uppercase tracking-wider">Loot Drop</div>
        <div class="text-sm font-black text-loot-purple">Void-Touched Helm</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const dpsList = [
  { name: 'IceCreamCone', dps: '1.2M', percent: 100, color: 'bg-mage-blue' },
  { name: 'Qbeans', dps: '1.1M', percent: 92, color: 'bg-rogue-yellow' },
  { name: 'BobbyIsOnFire', dps: '780k', percent: 85, color: 'bg-monk-green' },
]
</script>
