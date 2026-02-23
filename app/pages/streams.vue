<script lang="ts" setup>
import StreamCard from '~/components/streams/StreamCard.vue'

const mockStreams = [
  {
    id: '1',
    streamerName: 'Jesse',
    title: 'Mythic Raid Progression - Nerub-ar Palace',
    game: 'World of Warcraft',
    viewers: 1245,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', // generic gaming bg
    avatarUrl: 'https://avatars.githubusercontent.com/u/12345678?v=4', // placeholder
    isLive: true
  },
  {
    id: '2',
    streamerName: 'BobbyIsFire',
    title: 'High Keys +15 Push w/ the boyz',
    game: 'World of Warcraft',
    viewers: 842,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', // generic gaming bg
    avatarUrl: 'https://avatars.githubusercontent.com/u/23456789?v=4',
    isLive: true
  },
  {
    id: '3',
    streamerName: 'Icecream',
    title: 'Chill gold farming & mount runs',
    game: 'World of Warcraft',
    viewers: 231,
    thumbnailUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
    avatarUrl: 'https://avatars.githubusercontent.com/u/34567890?v=4',
    isLive: true
  },
  {
    id: '4',
    streamerName: 'Eir',
    title: 'Healing Mythic+ / Chatting',
    game: 'World of Warcraft',
    viewers: 512,
    thumbnailUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop',
    avatarUrl: 'https://avatars.githubusercontent.com/u/45678901?v=4',
    isLive: true
  },
  {
    id: '5',
    streamerName: 'Denton',
    title: 'Offline',
    game: 'World of Warcraft',
    viewers: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2165&auto=format&fit=crop',
    avatarUrl: 'https://avatars.githubusercontent.com/u/56789012?v=4',
    isLive: false
  },
  {
    id: '6',
    streamerName: 'MysticMage',
    title: 'Offline',
    game: 'World of Warcraft',
    viewers: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2147&auto=format&fit=crop',
    avatarUrl: 'https://avatars.githubusercontent.com/u/67890123?v=4',
    isLive: false
  }
]

const liveStreams = computed(() => mockStreams.filter(s => s.isLive))
const offlineStreams = computed(() => mockStreams.filter(s => !s.isLive))
</script>

<template>
  <div class="pt-32 pb-24 min-h-screen">
    <UContainer>
      <!-- Page Header -->
      <div class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 class="text-5xl md:text-6xl font-heading font-black text-white tracking-tight mb-2 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] [-webkit-text-stroke:2px_black] uppercase">
            Live Streams
          </h1>
          <p class="text-xl font-body text-white font-bold bg-black inline-block px-4 py-2 mt-2 -skew-x-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(216,180,254,1)]">
            Exercise in Futility <span class="text-[#d8b4fe] font-black not-italic px-2">|</span> Twitch Integrations Coming Soon
          </p>
        </div>
        
        <div class="bg-secondary border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none px-6 py-4 flex flex-col items-center transform transition hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] duration-200">
          <span class="text-sm font-black text-white uppercase tracking-widest mb-1">Active Streamers</span>
          <span class="text-3xl font-heading font-black text-white">{{ liveStreams.length }}</span>
        </div>
      </div>

      <!-- Live Streams Section -->
      <div v-if="liveStreams.length > 0" class="mt-12">
        <h2 class="text-3xl font-heading font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
          <span class="w-3 h-3 bg-red-600 rounded-full animate-pulse border border-black shadow-[1px_1px_0_rgba(0,0,0,1)]"></span>
          Live Now
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StreamCard 
            v-for="stream in liveStreams" 
            :key="stream.id" 
            :stream="stream" 
          />
        </div>
      </div>
      
      <!-- Empty State for Live -->
      <div v-else class="mt-12 bg-stone-900 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
        <h3 class="text-3xl font-heading font-black text-white uppercase mb-4">No Guild members are currently live</h3>
        <p class="text-stone-400 font-body font-bold text-lg">Check back later or join our Discord to see when we go live.</p>
      </div>

      <!-- Offline Streams Section -->
      <div v-if="offlineStreams.length > 0" class="mt-20">
        <h2 class="text-3xl font-heading font-black text-stone-400 uppercase tracking-wider mb-6 flex items-center gap-3 opacity-80">
          <span class="w-3 h-3 bg-stone-500 rounded-full border border-black"></span>
          Offline Streamers
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90">
          <StreamCard 
            v-for="stream in offlineStreams" 
            :key="stream.id" 
            :stream="stream" 
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
