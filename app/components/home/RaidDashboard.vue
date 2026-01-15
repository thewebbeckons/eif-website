<template>
  <div class="relative w-full max-w-sm mx-auto perspective-1000">
    <!-- Main Card (Damage Meter) -->
    <div class="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-stone-700 p-6 transform rotate-x-12 translate-y-10 opacity-90 hover:opacity-100 hover:transform-none transition-all duration-500 text-gray-900 dark:text-stone-100">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-heading font-bold text-lg">Top DPS</h3>
            <span class="text-xs font-mono text-gray-400 dark:text-stone-400">Nerub-ar</span>
      </div>
      
      <div class="space-y-3">
        <div v-for="(player, i) in dpsList" :key="i" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" :class="player.color">
            {{ i + 1 }}
          </div>
          <div class="flex-1">
            <div class="flex justify-between text-sm font-medium">
              <span>{{ player.name }}</span>
              <span class="font-mono">{{ player.dps }}</span>
            </div>
            <div class="h-1.5 bg-gray-100 dark:bg-stone-700 rounded-full mt-1 overflow-hidden">
              <div class="h-full rounded-full" :class="player.color" :style="{ width: player.percent + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Loot Toast -->
    <div class="absolute -right-8 -top-8 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-2xl shadow-xl p-3 border border-gray-100 dark:border-stone-700 flex items-center gap-3 animate-float" style="animation-delay: -2s">
      <div class="w-10 h-10 bg-loot-purple rounded-xl flex items-center justify-center text-white">
        <UIcon name="i-heroicons-star" class="w-6 h-6" />
      </div>
      <div>
        <div class="text-xs text-gray-400 dark:text-stone-400 font-medium">Loot Distributed</div>
        <div class="text-sm font-bold text-loot-purple">Void-Touched Helm</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const dpsList = [
  { name: 'IceCreamCone', dps: '1.2M', percent: 100, color: 'bg-mage-blue' },
  { name: 'Qbeans', dps: '1.1M', percent: 92, color: 'bg-rogue-yellow' },
  { name: 'BobbyIsOnFire', dps: '980k', percent: 85, color: 'bg-monk-green' },
]
</script>
