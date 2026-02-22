<script setup lang="ts">
import Hero from '~/components/home/Hero.vue'
import Features from '~/components/home/Features.vue'
import Vibes from '~/components/home/Vibes.vue'
import CTA from '~/components/home/CTA.vue'

useServerSeoMeta({
  title: 'Exercise in Futility | US-Illidan WoW Guild',
  description: 'Community-first raiding on Illidan. Good vibes, better loot, and zero toxicity.'
})
</script>

<template>
  <div class="min-h-screen font-body text-white selection:bg-purple-500 selection:text-white">
    <div class="relative z-10 pointer-events-none">
      <main class="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <Hero />
        <Features />
        <Vibes />
        <CTA />
      </main>
    </div>
  </div>
</template>
