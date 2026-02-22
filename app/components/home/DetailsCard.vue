<script setup lang="ts">
const dpsPlayers = [
  { name: 'TofuKat', color: 'bg-purple-600', width: 'w-[95%]', dps: '1.3M' },
  { name: 'Icecream', color: 'bg-cyan-400', width: 'w-[88%]', dps: '1.1M' },
  { name: 'VibeCheck', color: 'bg-blue-500', width: 'w-[82%]', dps: '980k' },
  { name: 'bobbyisfire', color: 'bg-orange-500', width: 'w-[40%]', dps: '490k' }
]
</script>

<template>
  <div class="w-full max-w-sm bg-zinc-900 border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-float-2">
    <div class="flex justify-between items-center mb-4 border-b-2 border-zinc-700 pb-2">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-activity" class="text-purple-400 w-5 h-5 shrink-0" />
        <span class="text-white font-black uppercase text-xs tracking-tighter">Details - Current Fight</span>
      </div>
    </div>
    <div class="space-y-3">
      <div v-for="(player, idx) in dpsPlayers" :key="idx" class="relative h-6 bg-zinc-800 border border-black overflow-hidden">
        <div :class="`absolute inset-0 ${player.color} ${player.width}`" />
        <div class="absolute inset-0 flex justify-between items-center px-2 text-[10px] font-black uppercase text-white drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
          <span>{{ idx + 1 }}. {{ player.name }}</span>
          <span>{{ player.dps }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float-hero-2 {
  0%, 100% { transform: translateY(0px) rotate(-3deg); }
  50% { transform: translateY(20px) rotate(-5deg); }
}
.animate-float-2 { animation: float-hero-2 5s ease-in-out infinite; }
</style>
