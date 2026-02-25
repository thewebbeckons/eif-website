<script setup lang="ts">
import { ref, onMounted } from "vue";
import BentoCard from "~/components/home/BentoCard.vue";
import qismsData from "~/assets/qisms.json";

const loading = ref(false);
const displayedText = ref("");
const typeSpeed = 30;

const fetchQuote = async () => {
  if (loading.value) return;

  loading.value = true;
  displayedText.value = "";

  // Artificial delay for the "thinking" effect
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const quotes = qismsData.quotes;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  loading.value = false;
  simulateTyping(randomQuote || "My mind is blank.");
};

const simulateTyping = (fullText: string) => {
  let currentIndex = 0;

  const typeText = () => {
    if (currentIndex < fullText.length) {
      displayedText.value += fullText.charAt(currentIndex);
      currentIndex++;
      setTimeout(typeText, typeSpeed);
    }
  };

  typeText();
};

onMounted(() => {
  simulateTyping("Click the button to generate a quote...");
});
</script>

<template>
  <BentoCard colorClass="bg-indigo-600" className="md:col-span-4">
    <div
      class="p-8 flex flex-col grow min-h-0 bg-indigo-500/30 relative overflow-hidden group"
    >
      <UIcon
        name="i-lucide-message-circle-question"
        class="absolute -right-6 -top-6 text-indigo-300 opacity-40 group-hover:scale-125 transition-transform duration-700 w-36 h-36 z-0"
      />

      <div class="flex items-center justify-between mb-4 relative z-10">
        <h3
          class="text-3xl font-black uppercase text-white drop-shadow-[2px_2px_0_black]"
        >
          Q-isms 🧠
        </h3>
      </div>
      <p class="text-indigo-100 font-bold mb-6 relative z-10">
        Tap into the profound wisdom of the one, the only, the Qyleth.
      </p>

      <div class="grow flex flex-col justify-end gap-6 relative z-10">
        <div class="flex items-start gap-4">
          <div
            class="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-black overflow-hidden bg-white shadow-[4px_4px_0_black]"
          >
            <img
              :src="loading ? '/AnimatedThinking.gif' : '/Thinking.png'"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>

          <div
            class="bg-white border-4 border-black p-4 relative shadow-[4px_4px_0_black] rounded-2xl rounded-tl-none grow min-h-20 flex flex-col gap-1"
          >
            <span
              class="text-xs font-black text-zinc-500 uppercase tracking-widest"
              >Qyleth</span
            >
            <div
              v-if="loading"
              class="flex gap-1.5 items-center justify-start h-full py-1.5"
            >
              <span
                class="w-3 h-3 bg-indigo-600 animate-pulse [animation-delay:-0.3s] rounded-full"
              ></span>
              <span
                class="w-3 h-3 bg-indigo-600 animate-pulse [animation-delay:-0.15s] rounded-full"
              ></span>
              <span
                class="w-3 h-3 bg-indigo-600 animate-pulse rounded-full"
              ></span>
            </div>
            <p
              v-else
              class="text-black font-black text-lg leading-tight relative z-10 italic"
            >
              "{{ displayedText }}"
              <span
                class="inline-block w-2 bg-indigo-500 animate-pulse h-[1em] mb-[-0.1em]"
              />
            </p>
          </div>
        </div>

        <button
          @click="fetchQuote"
          :disabled="loading"
          class="bg-lime-400 w-full border-4 border-black h-14 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 text-black flex items-center justify-center font-black uppercase text-lg tracking-wider mt-4"
        >
          <UIcon name="i-lucide-sparkles" class="w-5 h-5 mr-2" />
          Generate Wisdom
        </button>
      </div>
    </div>
  </BentoCard>
</template>
