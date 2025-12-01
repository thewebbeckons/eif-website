<script setup lang="ts">

</script>

<template>
  <header class="py-1 sticky top-8 z-10">
    <UContainer
      class=" flex flex-row justify-between items-center rounded-full py-3 border-4 border-(--ui-border-muted) bg-white dark:bg-(--ui-bg-muted)">
      <AppLogo class=" object-fit" />
      <nav class="flex flex-row space-x-4 items-center">
        <UButton color="primary" variant="link" to="/news">News</UButton>
        <UButton color="primary" variant="link" to="/streams">Streams</UButton>
        <UButton color="primary" variant="link" to="/roster">Roster</UButton>
        <!-- <UButton color="primary" variant="link" to="/events">Events</UButton> -->
        <UButton color="primary" variant="outline" @click="useJoinModal().open()" class="cursor-pointer">
          Join Us
        </UButton>
      </nav>
    </UContainer>
  </header>
</template>
