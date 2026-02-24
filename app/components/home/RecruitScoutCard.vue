<script setup lang="ts">
import { ref } from "vue";
import BentoCard from "~/components/home/BentoCard.vue";

const recruitmentInput = ref("");
const recruitmentFeedback = ref("");
const loadingRecruit = ref(false);

const scoutRecruit = async (e: Event) => {
  e.preventDefault();

  if (!recruitmentInput.value.trim()) {
    recruitmentFeedback.value =
      "The void stares back... and sees nothing. Try typing a class first, champion.";
    return;
  }

  loadingRecruit.value = true;
  recruitmentFeedback.value = "";

  try {
    const data = await $fetch<{ feedback: string }>("/api/recruit", {
      method: "POST",
      body: {
        classAndSpec: recruitmentInput.value,
      },
    });

    recruitmentFeedback.value = data.feedback;
  } catch (e: any) {
    // Check if it's our rate limit error
    if (e.statusCode === 429) {
      recruitmentFeedback.value =
        e.statusMessage || "Too many requests to the void. Give it a minute.";
    } else {
      recruitmentFeedback.value =
        "The scout is busy petting a cat (or the servers exploded). Try again.";
    }
  } finally {
    loadingRecruit.value = false;
  }
};
</script>

<template>
  <BentoCard colorClass="bg-indigo-600" className="md:col-span-4">
    <div class="p-8 flex flex-col grow min-h-0 bg-indigo-500/30">
      <div class="flex items-center justify-between mb-4">
        <h3
          class="text-3xl font-black uppercase text-white drop-shadow-[2px_2px_0_black]"
        >
          Recruitment Scout ✨
        </h3>
        <UIcon
          name="i-lucide-sparkles"
          class="text-yellow-300 w-8 h-8 shrink-0"
        />
      </div>
      <p class="text-indigo-100 font-bold mb-6">
        Enter your Class and Spec to see how you'll fit into our chaos.
      </p>

      <div class="grow space-y-4 flex flex-col justify-end">
        <form
          @submit="scoutRecruit"
          class="flex flex-col md:flex-row gap-4 md:items-center"
        >
          <input
            v-model="recruitmentInput"
            type="text"
            placeholder="e.g. Affliction Warlock"
            class="grow w-full bg-white border-4 border-black px-4 h-14 font-black placeholder:text-zinc-400 outline-none focus:ring-4 focus:ring-purple-400 transition-all text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
          <button
            :disabled="loadingRecruit"
            type="submit"
            class="bg-lime-400 w-full md:w-16 border-4 border-black h-14 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 text-black flex items-center justify-center shrink-0"
          >
            <UIcon name="i-lucide-send-horizontal" class="w-6 h-6" />
          </button>
        </form>

        <div
          class="bg-black/80 border-4 border-black p-4 grow min-h-[80px] flex items-center justify-center relative"
        >
          <div v-if="loadingRecruit" class="flex flex-col items-center gap-2">
            <UIcon
              name="i-lucide-loader-circle"
              class="animate-spin text-lime-400 w-10 h-10 shrink-0"
            />
            <span class="text-white text-xs font-black uppercase"
              >Analyzing your logs...</span
            >
          </div>
          <p v-else class="text-lime-400 text-lg font-black text-center italic">
            {{ recruitmentFeedback || "Waiting for your transmission..." }}
          </p>
        </div>
      </div>
    </div>
  </BentoCard>
</template>
