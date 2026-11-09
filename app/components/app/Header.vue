<script setup lang="ts">
const items = [
  { label: "News", to: "/news" },
  { label: "Streams", to: "/streams" },
  { label: "Roster", to: "/roster" },
  { label: "Hall of Fame", to: "/hall-of-fame" },
];
</script>

<template>
  <UHeader
    :ui="{
      root: 'mx-4 lg:mx-auto max-w-7xl rounded-3xl border-2 border-black bg-stone-900 shadow-[6px_6px_0_0_rgb(0,0,0)] z-50 fixed top-6 left-0 right-0',
      container: 'px-6 py-2',
      center: 'hidden lg:flex',
      content: 'bg-stone-900 border-l-2 border-black',
      header: 'bg-stone-900',
      body: 'bg-stone-900',
    }"
    :toggle="{
      class:
        'text-stone-300 hover:text-white hover:bg-zinc-800 transition-colors',
    }"
  >
    <template #left>
      <AppLogo />
    </template>

    <template #right>
      <UTooltip
        text="Coming soon..."
        :content="{ side: 'bottom' }"
        :ui="{
          content:
            'rounded-none border-2 border-black bg-stone-800 font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_black] ring-0',
        }"
      >
        <UButton
          size="sm"
          label="Sign in"
          icon="i-lucide-log-in"
          color="neutral"
          variant="ghost"
          type="button"
          aria-label="Sign in (coming soon)"
          class="text-stone-300 hover:text-white bg-purple-500 hover:bg-purple-600 cursor-pointer hidden sm:flex"
        />
      </UTooltip>
    </template>

    <template #default>
      <UNavigationMenu
        :items="items"
        :ui="{
          link: 'text-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none rounded-md',
        }"
      />
    </template>
    <template #body>
      <div class="mobile-menu-enter flex flex-col gap-4">
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{
            link: 'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none rounded-md',
          }"
        />
      </div>
    </template>
  </UHeader>
</template>

<style scoped>
/* Slide/blur-in for the mobile menu (replaces the motion-v spring). */
.mobile-menu-enter {
  animation: mobile-menu-enter 0.4s cubic-bezier(0.34, 1.3, 0.64, 1) 0.1s both;
}

@keyframes mobile-menu-enter {
  from {
    opacity: 0;
    transform: translateX(-20px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
    filter: blur(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-menu-enter {
    animation: none;
  }
}
</style>
