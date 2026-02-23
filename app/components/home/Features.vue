<script setup lang="ts">
import { ref } from 'vue'
import BentoCard from '~/components/home/BentoCard.vue'

type ExplodingCat = { id: number; x: number; y: number; emoji: string; tx: number; ty: number; r: number }
const explodingCats = ref<ExplodingCat[]>([])
let catIdCounter = 0
const catEmojis = ['🐱', '🦁', '🐈', '😸', '😹', '😻', '😼', '😽', '🙀']

const handleCatClick = (e: MouseEvent) => {
  const count = 12 + Math.floor(Math.random() * 8)
  const newCats: ExplodingCat[] = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = 50 + Math.random() * 150
    const tx = Math.cos(angle) * distance
    const ty = Math.sin(angle) * distance - 50
    const r = (Math.random() - 0.5) * 360
    newCats.push({
      id: catIdCounter++,
      x: e.clientX,
      y: e.clientY,
      emoji: catEmojis[Math.floor(Math.random() * catEmojis.length)] || '🐱',
      tx,
      ty,
      r
    })
  }
  
  explodingCats.value.push(...newCats)

  setTimeout(() => {
    explodingCats.value = explodingCats.value.filter(cat => !newCats.some(c => c.id === cat.id))
  }, 1000)
}

const recruitmentInput = ref("")
const recruitmentFeedback = ref("")
const loadingRecruit = ref(false)

const scoutRecruit = async (e: Event) => {
  e.preventDefault()
  if (!recruitmentInput.value) return
  loadingRecruit.value = true
  try {
    // Mock API
    await new Promise(resolve => setTimeout(resolve, 800))
    recruitmentFeedback.value = `As a ${recruitmentInput.value}, your chances are high. Just don't stand in the fire and pay the cat tax.`
  } catch (e) {
    recruitmentFeedback.value = "The scout is busy petting a cat. Try again."
  }
  loadingRecruit.value = false
}
</script>

<template>
  <section id="unique" class="space-y-16 pointer-events-none mt-24 md:mt-40">
    <div class="text-center space-y-4 pointer-events-auto">
      <h2 class="text-6xl md:text-[7rem] font-black uppercase tracking-tighter leading-none italic text-purple-400 drop-shadow-[4px_4px_0px_black]">
        Why <span class="text-white">Choose</span> Us?
      </h2>
      <p class="text-2xl font-black uppercase bg-purple-600 text-white inline-block px-6 py-2 rotate-1 shadow-[4px_4px_0px_0px_black]">
        More than just a guild, we're a family
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[340px] md:auto-rows-[400px] pointer-events-auto text-black">
      
      <!-- Recruitment Scout -->
      <BentoCard colorClass="bg-indigo-600" className="md:col-span-2">
        <div class="p-8 flex flex-col h-full bg-indigo-500/30">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-3xl font-black uppercase text-white drop-shadow-[2px_2px_0_black]">Recruitment Scout ✨</h3>
            <UIcon name="i-lucide-sparkles" class="text-yellow-300 w-8 h-8 shrink-0" />
          </div>
          <p class="text-indigo-100 font-bold mb-6">Enter your Class and Spec to see how you'll fit into our chaos.</p>
          
          <div class="grow space-y-4 flex flex-col justify-end">
            <form @submit="scoutRecruit" class="flex gap-4">
              <input 
                v-model="recruitmentInput"
                type="text" 
                placeholder="e.g. Affliction Warlock" 
                class="grow bg-white border-4 border-black p-4 font-black placeholder:text-zinc-400 outline-none focus:ring-4 focus:ring-purple-400 transition-all text-black"
              />
              <button 
                :disabled="loadingRecruit"
                type="submit"
                class="bg-lime-400 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 text-black flex items-center justify-center shrink-0 w-16"
              >
                <UIcon name="i-lucide-send-horizontal" class="w-6 h-6" />
              </button>
            </form>
            
            <div class="bg-black/80 border-4 border-black p-6 grow min-h-[100px] flex items-center justify-center relative">
              <div v-if="loadingRecruit" class="flex flex-col items-center gap-2">
                <UIcon name="i-lucide-loader-circle" class="animate-spin text-lime-400 w-10 h-10 shrink-0" />
                <span class="text-white text-xs font-black uppercase">Analyzing your logs...</span>
              </div>
              <p v-else class="text-lime-400 text-lg font-black text-center italic">
                {{ recruitmentFeedback || "Waiting for your transmission..." }}
              </p>
            </div>
          </div>
        </div>
      </BentoCard>

      <!-- AOTC Card -->
      <BentoCard colorClass="bg-orange-500">
        <div class="grow flex items-center justify-center p-8 bg-orange-400/20 relative overflow-hidden">
          <UIcon name="i-lucide-star" class="absolute -right-6 -top-6 text-purple-300 opacity-40 group-hover:scale-125 transition-transform duration-700 w-36 h-36" />
          <div class="bg-white border-4 border-black p-5 flex items-center gap-5 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rotate-2 group-hover:rotate-0 transition-transform relative z-10 w-full">
            <div class="bg-yellow-400 border-4 border-black p-3 flex shrink-0"><UIcon name="i-lucide-trophy" class="w-8 h-8" /></div>
            <div class="flex flex-col overflow-hidden">
              <span class="text-xs font-black uppercase text-orange-600">Achieved!</span>
              <span class="text-xl font-black uppercase leading-tight">Ahead of Curve</span>
            </div>
          </div>
        </div>
        <div class="bg-orange-700 p-8 border-t-4 border-black text-white">
          <h3 class="text-3xl font-black uppercase drop-shadow-[2px_2px_0_black]">AOTC Raiding</h3>
          <p class="text-sm font-bold opacity-90">2 Nights a week, AotC every tier.</p>
        </div>
      </BentoCard>

      <!-- M+ Card -->
      <BentoCard colorClass="bg-blue-500">
        <div class="grow p-8 space-y-4 flex flex-col justify-center bg-blue-400/30">
          <div class="bg-white border-4 border-black p-3 flex items-center gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-2 transition-transform w-[90%]">
            <span class="bg-blue-500 text-white px-2 py-1 text-xs font-black border-2 border-black">+13</span>
            <span class="text-sm font-black uppercase truncate">Ara-Kara</span>
          </div>
          <div class="bg-white border-4 border-black p-3 flex items-center gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-2 transition-transform w-[90%] self-end">
            <span class="bg-pink-500 text-white px-2 py-1 text-xs font-black border-2 border-black">+11</span>
            <span class="text-sm font-black uppercase truncate">Threads</span>
          </div>
        </div>
        <div class="bg-blue-700 p-8 border-t-4 border-black text-white">
          <h3 class="text-3xl font-black uppercase drop-shadow-[2px_2px_0_black]">M+ Groups</h3>
          <p class="text-sm font-bold opacity-90">Multiple groups for running keys.</p>
        </div>
      </BentoCard>

      <!-- Stream Card -->
      <BentoCard colorClass="bg-pink-500">
        <div class="grow flex items-center justify-center p-8 bg-pink-400/20">
          <div class="bg-white border-4 border-black p-6 w-full shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-1 transition-transform">
            <div class="flex justify-between items-center mb-4">
              <span class="text-[10px] font-black uppercase text-pink-600">Weekly Stream</span>
              <div class="bg-red-600 px-2 py-0.5 border-2 border-black animate-pulse flex items-center gap-1">
                <span class="text-[10px] font-black text-white leading-none">LIVE</span>
              </div>
            </div>
            <h4 class="text-xl font-black uppercase leading-none mb-3 text-black">Raid Night Recap</h4>
            <div class="bg-pink-600 text-white font-black text-center py-2 text-xs border-2 border-black">WED/SUN 8PM EST</div>
          </div>
        </div>
        <div class="bg-pink-700 p-8 border-t-4 border-black text-white">
          <h3 class="text-3xl font-black uppercase drop-shadow-[2px_2px_0_black]">Weekly Streams</h3>
          <p class="text-sm font-bold opacity-90">Catch the highlights.</p>
        </div>
      </BentoCard>

      <!-- Cat Card -->
      <BentoCard colorClass="bg-purple-500" className="cursor-pointer" @click="handleCatClick">
        <div class="grow flex items-center justify-center p-8 bg-purple-400/20">
          <div class="flex -space-x-6">
            <div v-for="(cat, i) in ['🐱', '🦁', '🐈']" :key="i" class="w-16 h-16 rounded-full border-4 border-black bg-white flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-2 transition-transform">{{ cat }}</div>
          </div>
        </div>
        <div class="bg-purple-700 p-8 border-t-4 border-black text-white">
          <h3 class="text-3xl font-black uppercase drop-shadow-[2px_2px_0_black]">We Love Cats</h3>
          <p class="text-sm font-bold opacity-90">Unwritten guild rule, must love cats.</p>
        </div>
      </BentoCard>

    </div>
  </section>

  <Teleport to="body">
    <div 
      v-for="cat in explodingCats" 
      :key="cat.id"
      class="fixed pointer-events-none z-50 text-4xl animate-[explode-cat_1s_cubic-bezier(0.25,1,0.5,1)_forwards] drop-shadow-md select-none"
      :style="{
        left: `${cat.x}px`,
        top: `${cat.y}px`,
        '--tx': `${cat.tx}px`,
        '--ty': `${cat.ty}px`,
        '--r': `${cat.r}deg`
      }"
    >
      {{ cat.emoji }}
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes explode-cat {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.5) rotate(var(--r));
  }
}
</style>
