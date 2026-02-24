<script setup lang="ts">
import NeoButton from "~/components/home/NeoButton.vue";

const joinModal = useJoinModal();
</script>

<template>
  <section
    class="bg-purple-900 border-8 border-white p-12 text-center shadow-[12px_12px_0px_0px_#06b6d4] my-24 md:my-40 pointer-events-auto"
  >
    <h2
      class="text-5xl md:text-7xl font-black uppercase text-white drop-shadow-[4px_4px_0px_black] mb-8"
    >
      Ready to Deplete?
    </h2>
    <div class="flex justify-center">
      <UButton
        icon="i-lucide-pencil"
        color="secondary"
        variant="solid"
        size="xl"
        @click="joinModal.open()"
      >
        Drop an App
      </UButton>
    </div>
  </section>
</template>
