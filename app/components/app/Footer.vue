<script lang="ts" setup>
// neo-brutalist footer
</script>

<template>
  <footer
    class="w-full bg-black text-white p-12 border-t-8 border-purple-600 pointer-events-auto relative z-40"
  >
    <div
      class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8"
    >
      <div class="flex flex-col items-center sm:items-start gap-1">
        <AppLogo />
        <p class="sm:ml-10 text-sm text-purple-300 font-bold uppercase mt-1">
          Illidan • US
        </p>
      </div>
      <div
        class="flex flex-col items-center gap-2 text-center sm:items-end sm:text-right"
      >
        <nav class="flex space-x-4 text-sm font-bold text-gray-400">
          <NuxtLink to="/news" class="hover:text-white">News</NuxtLink>
          <NuxtLink to="/streams" class="hover:text-white">Streams</NuxtLink>
          <NuxtLink to="/roster" class="hover:text-white">Roster</NuxtLink>
        </nav>
        <p class="text-zinc-500 font-bold">
          © {{ new Date().getFullYear() }} Exercise in Futility. Entering the
          Midnight.
        </p>
      </div>
    </div>
  </footer>
</template>
