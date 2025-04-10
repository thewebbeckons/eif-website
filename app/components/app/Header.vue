<template>
  <header class="py-1 sticky top-0 z-10 border-b border-b-gray-200 bg-white">
    <UContainer class="flex flex-row justify-between items-center py-3  ">
      <AppLogo class="object-fit" />
      <nav class="flex flex-row space-x-4">
        <UButton color="primary" variant="link" to="/news">News</UButton>
        <UButton color="primary" variant="link" to="/streams">Streams</UButton>
        <UButton color="primary" variant="link" to="/roster">Roster</UButton>
        <!-- <UButton color="primary" variant="link" to="/events">Events</UButton> -->
        <UButton color="primary" variant="soft" @click="console.log('Sign Up clicked')" class="cursor-pointer">
          Join Us
        </UButton>
      </nav>
    </UContainer>
  </header>
</template>
