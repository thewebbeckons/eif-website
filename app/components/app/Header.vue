<script setup lang="ts">
const items = [
  { label: "News", to: "/news" },
  { label: "Streams", to: "/streams" },
  { label: "Roster", to: "/roster" },
  { label: "Hall of Fame", to: "/hall-of-fame" },
  { label: "Recruitment", to: "/recruitment" },
];

const { user, ready, signOut, signInUrl } = useAuth();

const memberItems = [
  [
    { label: "Your account", icon: "i-lucide-user", to: "/account" },
    { label: "Recruitment", icon: "i-lucide-users", to: "/recruitment" },
  ],
  [{ label: "Sign out", icon: "i-lucide-log-out", onSelect: signOut }],
];

// The header button is hidden on small screens, so the mobile menu carries
// the same account links.
const mobileItems = computed(() => [
  ...items,
  ...(user.value ? [{ label: "Your account", to: "/account" }] : []),
]);
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
      <!-- Signed-in state is only known in the browser, so nothing renders
           here until the session check has finished. -->
      <template v-if="ready">
        <UDropdownMenu
          v-if="user"
          :items="memberItems"
          :content="{ align: 'end' }"
          :ui="{
            content:
              'rounded-none border-2 border-black bg-stone-800 shadow-[4px_4px_0_0_black] ring-0',
            item: 'font-black uppercase tracking-wider text-white',
          }"
        >
          <UButton
            size="sm"
            :label="user.displayName"
            :avatar="{
              src: user.avatarUrl || undefined,
              alt: user.displayName,
            }"
            trailing-icon="i-lucide-chevron-down"
            color="neutral"
            variant="ghost"
            class="hidden max-w-48 bg-purple-500 text-white hover:bg-purple-600 sm:flex"
            :ui="{ label: 'truncate' }"
          />
        </UDropdownMenu>
        <UButton
          v-else
          :to="signInUrl"
          external
          size="sm"
          label="Sign in"
          icon="i-lucide-log-in"
          color="neutral"
          variant="ghost"
          class="hidden bg-purple-500 text-stone-100 hover:bg-purple-600 hover:text-white sm:flex"
        />
      </template>
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
          :items="mobileItems"
          orientation="vertical"
          :ui="{
            link: 'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none rounded-md',
          }"
        />
        <template v-if="ready">
          <UButton
            v-if="user"
            label="Sign out"
            icon="i-lucide-log-out"
            color="neutral"
            class="justify-center bg-stone-800 text-white hover:bg-stone-700 sm:hidden"
            @click="signOut"
          />
          <UButton
            v-else
            :to="signInUrl"
            external
            label="Sign in"
            icon="i-lucide-log-in"
            class="justify-center bg-purple-500 text-white hover:bg-purple-600 sm:hidden"
          />
        </template>
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
