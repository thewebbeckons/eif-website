<script setup lang="ts">
import { ref } from "vue";
import NeoButton from "~/components/home/NeoButton.vue";
import LootCard from "~/components/home/LootCard.vue";
import DetailsCard from "~/components/home/DetailsCard.vue";

const props = defineProps<{
  description?: string;
}>();

const { open } = useJoinModal();

const wipeMotivation = ref("");
const loadingWipe = ref(false);

const generateWipeWisdom = async () => {
  loadingWipe.value = true;
  try {
    // Mock API call for now
    await new Promise((resolve) => setTimeout(resolve, 800));
    wipeMotivation.value =
      "Even the void is disappointed in that pull. Try pressing buttons next time?";
  } catch (e) {
    wipeMotivation.value = "The Void ate my response. Try again.";
  }
  loadingWipe.value = false;
};
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
      <DetailsCard @drop-app="open" />
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
