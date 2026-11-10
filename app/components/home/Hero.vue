<script setup lang="ts">
import LootCard from "~/components/home/LootCard.vue";
import DetailsCard from "~/components/home/DetailsCard.vue";

const props = defineProps<{
  description?: string;
}>();
</script>

<template>
  <section
    class="relative flex flex-col lg:flex-row items-center justify-between gap-12 mt-22 md:mt-12 min-h-[60vh] pointer-events-none"
  >
    <div class="max-w-3xl space-y-8 z-10 relative pointer-events-auto">
      <h2
        class="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-black uppercase leading-[0.85] tracking-tight text-white drop-shadow-[4px_4px_0px_#a855f7]"
      >
        The Friendliest Guild on <br />
        <span class="text-purple-400 relative">
          <!-- Text outline handled by brutalist drop-shadow or custom stroke class in global css -->
          <span
            style="-webkit-text-stroke: 2px black"
            class="drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]"
            >US-Illidan</span
          >
        </span>
      </h2>

      <div
        class="bg-zinc-900 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block relative -rotate-2 w-full max-w-xl"
      >
        <p class="text-xl font-bold text-zinc-100 mb-4 whitespace-pre-wrap">
          {{
            props.description ||
            "Community-first raiding on Illidan. Good vibes, better loot, and zero toxicity."
          }}
        </p>
        <WipeWisdomButton />
      </div>
    </div>

    <div
      class="relative w-full lg:w-1/2 flex flex-col md:flex-row lg:flex-col items-center justify-center gap-12 z-10 pointer-events-auto"
    >
      <!-- Loot Card -->
      <LootCard />

      <!-- Details Card -->
      <DetailsCard />
    </div>
  </section>
</template>

