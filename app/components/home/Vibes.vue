<script setup lang="ts">
const rules = [
  "Community First.",
  "Zero Toxicity.",
  "Mandatory Bad Jokes.",
  "Wipefests are fun.",
  "All Welcome!"
]
</script>

<template>
  <section id="vibes" class="bg-zinc-900 border-8 border-white p-8 md:p-16 shadow-[16px_16px_0px_0px_#a855f7] relative pointer-events-auto mt-24 md:mt-40">
    <div class="absolute -top-12 -left-6 bg-purple-500 border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-5deg]">
      <span class="text-3xl font-black uppercase tracking-wider text-white drop-shadow-[2px_2px_0_black]">The Vibes</span>
    </div>
    
    <div class="mt-8 flex flex-col lg:flex-row gap-12">
      <div class="flex-1 space-y-6">
        <h3 class="text-4xl lg:text-5xl font-black uppercase leading-none text-white drop-shadow-[2px_2px_0_black]">
          Don't Stand in the <span class="text-purple-400 underline decoration-8 underline-offset-8">Void</span>, or do we aren't your mom.
        </h3>
        <p class="text-2xl font-mono font-semibold text-zinc-300">
          WoW is better with friends. We bring the flasks and the cosmic laughs. Get ready to have a great time! Just don't tell the healers I told you to stand in the void.
        </p>
      </div>
      
      <div class="flex-1">
        <ul class="space-y-4">
          <li v-for="(item, i) in rules" :key="i" class="flex items-center gap-4 bg-purple-700 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#ec4399] hover:scale-[1.02] transition-transform">
            <UIcon name="i-lucide-flame" class="w-8 h-8 text-pink-500 shrink-0" style="fill: #ec4899; stroke: black; stroke-width: 2px;" />
            <span class="text-xl font-mono font-black uppercase text-white drop-shadow-[2px_2px_0_black]">{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
