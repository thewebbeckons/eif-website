<script setup lang="ts">
const loading = ref(false);
const displayedText = ref("");
const showModal = ref(false);

const typeSpeed = 30;
let typingTimer: ReturnType<typeof setTimeout> | undefined;

const stopTyping = () => {
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = undefined;
};

const simulateTyping = (fullText: string) => {
  stopTyping();
  let currentIndex = 0;

  const typeText = () => {
    if (currentIndex >= fullText.length) {
      typingTimer = undefined;
      return;
    }

    displayedText.value += fullText.charAt(currentIndex);
    currentIndex += 1;
    typingTimer = setTimeout(typeText, typeSpeed);
  };

  typeText();
};

const fetchWisdom = async () => {
  if (loading.value) return;

  stopTyping();
  showModal.value = true;
  loading.value = true;
  displayedText.value = "";

  try {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const data = await $fetch<{ quote: string }>("/api/wisdom/random");

    if (!data.quote) throw new Error("Wisdom response was empty.");
    simulateTyping(data.quote);
  } catch (error) {
    console.error("Failed to fetch wipe wisdom", error);
    simulateTyping("We seem to have wiped the wisdom generator. Try again.");
  } finally {
    loading.value = false;
  }
};

watch(showModal, (isOpen) => {
  if (!isOpen) stopTyping();
});

onBeforeUnmount(stopTyping);
</script>

<template>
  <div class="flex w-full flex-col items-center gap-4">
    <UButton
      icon="i-lucide-sparkles"
      size="xl"
      color="primary"
      variant="solid"
      class="w-full sm:w-auto"
      @click="fetchWisdom"
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
          class="relative w-full border-2 border-zinc-700 bg-zinc-900 p-8 pt-12 sm:p-10 sm:pt-12"
        >
          <div
            class="absolute -top-3 left-4 border-2 border-zinc-950 bg-primary-500 px-2 py-1 text-xs font-bold uppercase text-zinc-950"
          >
            QI Analysis
          </div>

          <div
            v-if="loading"
            class="flex min-h-24 flex-col items-center justify-center space-y-4 py-8"
          >
            <div class="flex items-center space-x-2">
              <span
                class="size-3 animate-pulse bg-primary-500 [animation-delay:-0.3s]"
              />
              <span
                class="size-3 animate-pulse bg-primary-500 [animation-delay:-0.15s]"
              />
              <span class="size-3 animate-pulse bg-primary-500" />
            </div>
            <p
              class="animate-pulse font-mono text-sm font-bold uppercase tracking-widest text-primary-500"
            >
              Running advanced failure analysis…
            </p>
          </div>

          <p
            v-else
            class="mt-2 min-h-12 font-mono text-lg leading-relaxed text-zinc-300 md:text-xl"
          >
            {{ displayedText }}
            <span
              class="mb-[-0.1em] inline-block h-[1em] w-2 animate-pulse bg-primary-500"
            />
          </p>
        </div>
      </template>
    </UModal>
  </div>
</template>
