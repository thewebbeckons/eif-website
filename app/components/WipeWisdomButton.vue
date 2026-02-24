<script setup lang="ts">
// State
const loading = ref(false);
const wisdomObject = ref<{ quote: string } | null>(null);
const displayedText = ref("");
const showModal = ref(false);

const typeSpeed = 30; // milliseconds per character

const fetchWisdom = async () => {
  if (loading.value) return;

  showModal.value = true;
  loading.value = true;
  displayedText.value = "";

  try {
    // Add artificial delay for the "AI is thinking" effect
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const data = await $fetch<{ quote: string }>("/api/wisdom/random");

    if (!data || !data.quote) {
      throw new Error("Failed to fetch wisdom");
    }

    wisdomObject.value = { quote: data.quote };
    loading.value = false;
    simulateTyping(data.quote);
  } catch (err) {
    console.error(err);
    wisdomObject.value = {
      quote: "We seem to have wiped the wisdom generator. Try again.",
    };
    loading.value = false;
    simulateTyping(wisdomObject.value.quote);
  }
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
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <UButton
      icon="i-heroicons-sparkles"
      size="xl"
      color="primary"
      variant="solid"
      @click="fetchWisdom"
      class="w-full sm:w-auto font-bold neo-shadow"
    >
      Wipe Wisdom
    </UButton>

    <UModal
      v-model:open="showModal"
      :overlay="false"
      :ui="{ content: 'sm:max-w-2xl p-8 bg-zinc-900 ring-zinc-800' }"
    >
      <template #content>
        <div
          class="p-8 pt-12 sm:p-10 sm:pt-12 w-full relative border-2 border-zinc-700 bg-zinc-900"
        >
          <div
            class="absolute -top-3 left-4 bg-primary-500 text-zinc-950 text-xs font-bold px-2 py-1 uppercase border-2 border-zinc-950"
          >
            QI Analysis
          </div>

          <div
            v-if="loading"
            class="flex flex-col items-center justify-center py-8 min-h-24 space-y-4"
          >
            <div class="flex items-center space-x-2">
              <span
                class="w-3 h-3 bg-primary-500 animate-pulse [animation-delay:-0.3s]"
              ></span>
              <span
                class="w-3 h-3 bg-primary-500 animate-pulse [animation-delay:-0.15s]"
              ></span>
              <span class="w-3 h-3 bg-primary-500 animate-pulse"></span>
            </div>
            <p
              class="text-primary-500 font-mono text-sm uppercase font-bold tracking-widest animate-pulse"
            >
              Running advanced failure analysis...
            </p>
          </div>

          <p
            v-else
            class="mt-2 text-lg md:text-xl font-mono text-zinc-300 leading-relaxed min-h-12"
          >
            {{ displayedText }}
            <span
              class="inline-block w-2 bg-primary-500 animate-pulse h-[1em] mb-[-0.1em]"
            />
          </p>
        </div>
      </template>
    </UModal>
  </div>
</template>
