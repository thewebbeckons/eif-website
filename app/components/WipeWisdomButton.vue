<script setup lang="ts">

// State
const loading = ref(false);
const wisdomObject = ref<{ quote: string } | null>(null);
const displayedText = ref('');
const showQuote = ref(false);

const typeSpeed = 30; // milliseconds per character

const fetchWisdom = async () => {
  if (loading.value) return;

  loading.value = true;
  showQuote.value = false;
  displayedText.value = '';

  try {
    // Add artificial delay for the "AI is thinking" effect
    await new Promise((resolve) => setTimeout(resolve, 800));

    const data = await $fetch<{ quote: string }>('/api/wisdom/random');

    if (!data || !data.quote) {
      throw new Error('Failed to fetch wisdom');
    }

    wisdomObject.value = { quote: data.quote };
    showQuote.value = true;
    simulateTyping(data.quote);
  } catch (err) {
    console.error(err);
    wisdomObject.value = { quote: 'We seem to have wiped the wisdom generator. Try again.' };
    showQuote.value = true;
    simulateTyping(wisdomObject.value.quote);
  } finally {
    loading.value = false;
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
      :loading="loading"
      @click="fetchWisdom"
      class="w-full sm:w-auto font-bold neo-shadow"
    >
      Wipe Wisdom
    </UButton>

    <div
      v-if="showQuote"
      class="mt-4 p-6 bg-zinc-900 border-2 border-zinc-700 w-full max-w-2xl relative shadow-[4px_4px_0px_0px_theme('colors.primary.500')]"
      
      :initial="{ opacity: 0, y: 10 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
    >
      <div class="absolute -top-3 left-4 bg-primary-500 text-zinc-950 text-xs font-bold px-2 py-1 uppercase border-2 border-zinc-950">
        AI Analysis
      </div>
      <p class="text-lg md:text-xl font-mono text-zinc-300 leading-relaxed min-h-[3rem]">
        {{ displayedText }}
        <span class="inline-block w-2 bg-primary-500 animate-pulse h-[1em] mb-[-0.1em]" />
      </p>
    </div>
  </div>
</template>


