<template>
  <UApp>
    <AppHeader />
    <NuxtPage />
    <USeparator icon="i-lucide-heart" type="dashed" class="h-px" :ui="{ icon: 'text-primary dark:text-primary-500' }" />
    <AppFooter />
    <AppJoinModal />
  </UApp>
</template>
