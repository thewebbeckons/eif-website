<script lang="ts" setup></script>
<template>
  <UContainer class="py-24 sm:py-32 md:py-40 relative">
    <section
      class="mx-auto px-4 sm:px-6 lg:px-8 gap-16 sm:gap-y-24 max-w-4xl flex flex-col text-center"
    >
      <div>
        <h1
          class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl mb-3"
        >
          A <span class="text-primary">Heroic</span> Guild
        </h1>
        <p
          class="text-slate-600 text-lg font-thin md:text-xl dark:text-slate-300 tracking-wide"
        >
          We are an inclusive World of Warcraft guild on the US-Illidan server.
          We are a diverse group of friends who have been playing together for
          years. We are currently raiding in Dragonflight and are actively
          seeking new members to join our ranks.
        </p>
      </div>
    </section>
    <section class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center">
      <UButton
        class="transition-shadow hover:shadow-[5px_5px_0px_0px_rgba(109,40,217)] hover:skew-y-1"
        >Join Us</UButton
      >
      <UButton variant="outline">Discord</UButton>
    </section>
  </UContainer>
</template>
