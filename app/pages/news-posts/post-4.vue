<script setup lang="ts">
import NewsHero from '~/components/news/NewsHero.vue'
import NewsTextCard from '~/components/news/NewsTextCard.vue'
import NewsCallToAction from '~/components/news/NewsCallToAction.vue'
import NewsImageGallery from '~/components/news/NewsImageGallery.vue'
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 pt-40 md:pt-52 pb-24 relative z-10 min-h-screen flex flex-col gap-12 md:gap-16">
    <NewsHero 
      title="We're Rebuilding for the Next Expansion" 
      date="August 02, 2024" 
      tag="Recruitment"
    />
    
    <NewsTextCard variant="highlight">
      <h2>Calling All Degenerates</h2>
      <p>
        As we wind down the current tier, we are looking ahead to the upcoming expansion. 
        We are doing a massive recruitment drive to fill out our rosters for both the 
        Hardcore Progression Team and the Casual Weekend Team.
      </p>
    </NewsTextCard>

    <NewsImageGallery 
      :columns="3"
      :images="[
        { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop' }
      ]"
    />

    <NewsCallToAction 
      heading="Join the Discord" 
      text="Drop by the #recruitment channel, post your logs, and let's have a chat."
      buttonLabel="Join Server"
      color="bg-yellow-400"
    />
  </div>
</template>
