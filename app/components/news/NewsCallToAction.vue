<script setup lang="ts">
import NeoButton from "~/components/home/NeoButton.vue";

defineProps<{
  heading: string;
  text?: string;
  buttonLabel: string;
  buttonLink?: string;
  action?: () => void;
  color?: string;
}>();
</script>

<template>
  <div
    class="w-full bg-zinc-900 border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]"
  >
    <div class="flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="flex-1">
        <h3
          class="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 style-text-shadow"
        >
          {{ heading }}
        </h3>
        <p v-if="text" class="text-lg text-zinc-300 font-medium">
          {{ text }}
        </p>
      </div>
      <div class="shrink-0 w-full md:w-auto flex justify-center">
        <NuxtLink v-if="buttonLink" :to="buttonLink" class="w-full md:w-auto">
          <NeoButton
            :label="buttonLabel"
            :colorClass="color || 'bg-yellow-400'"
            class="w-full md:w-auto whitespace-nowrap cursor-pointer"
          />
        </NuxtLink>
        <NeoButton
          v-else
          @click="action"
          :label="buttonLabel"
          :colorClass="color || 'bg-yellow-400'"
          class="w-full md:w-auto whitespace-nowrap"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-text-shadow {
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 1);
}
</style>
