<script lang="ts" setup>
</script>

<template>
  <UFooter class="bg-gray-50 dark:bg-(--ui-bg-muted)">
    <template #left>
      <AppLogo />
    </template>

    <template #right>
      <nav class="flex flex-row space-x-4 items-center">
        <UButton color="primary" variant="link" to="/news">News</UButton>
        <UButton color="primary" variant="link" to="/streams">Streams</UButton>
        <UButton color="primary" variant="link" to="/roster">Roster</UButton>
        <UButton color="primary" variant="soft" to="/join" class="cursor-pointer">
          Join Us
        </UButton>
      </nav>
    </template>

    <USeparator />

    <template #bottom>
      <UContainer>
        <div class="flex flex-col sm:flex-row justify-between items-center w-full">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} EIF. All rights reserved.
          </p>
          <div class="flex space-x-4 mt-4 sm:mt-0">
            <UButton to="/terms" variant="link" color="neutral" size="xs">Terms</UButton>
            <UButton to="/privacy" variant="link" color="neutral" size="xs">Privacy</UButton>
            <UButton to="/cookies" variant="link" color="neutral" size="xs">Cookies</UButton>
          </div>
        </div>
      </UContainer>
    </template>
  </UFooter>
</template>