<script lang="ts" setup>
const ui = {
  rounded: "rounded-none",
  color: {
    white: {
      outline: "border-white text-white hover:bg-white hover:text-black",
    },
    primary: {
      outline:
        "border-primary bg-white text-primary transition-shadow hover:bg-primary hover:text-white shadow-[5px_5px_0px_0px_rgba(109,40,217)] hover:shadow-[7px_7px_0px_0px_rgba(109,40,217)]",
    },
  },
};
</script>
<template>
  <header class="py-3 sticky top-0 z-10">
    <UContainer
      class="flex flex-row justify-between items-center py-3 bg-slate-900 rounded-lg shadow-sm dark:bg-slate-700"
    >
      <AppLogo class="object-fit" />
      <nav class="flex flex-row space-x-4 text-white">
        <UButton :ui="ui" color="white" variant="outline" to="/news"
          >News</UButton
        >
        <UButton :ui="ui" color="white" variant="outline" to="/roster"
          >Roster</UButton
        >
        <UButton :ui="ui" color="white" variant="outline" to="/streams"
          >Streams</UButton
        >
        <UButton :ui="ui" variant="outline" to="/join" class="hover:skew-y-1"
          >Join Us</UButton
        >
      </nav>
    </UContainer>
  </header>
</template>
