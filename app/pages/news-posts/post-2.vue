<script setup lang="ts">
import NewsHero from '~/components/news/NewsHero.vue'
import NewsTextCard from '~/components/news/NewsTextCard.vue'
import NewsImageGallery from '~/components/news/NewsImageGallery.vue'
import NewsCallToAction from '~/components/news/NewsCallToAction.vue'
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 pt-40 md:pt-52 pb-24 relative z-10 min-h-screen flex flex-col gap-12 md:gap-16">
    <NewsHero 
      title="Mythic Fyrakk Goes Down" 
      date="October 28, 2024" 
      tag="Raid Recap"
    />
    
    <NewsTextCard>
      <h2>Finally, The Dragon Falls</h2>
      <p>
        After 300 wipes and countless broken keyboards, we finally managed to coordinate the dispels and 
        bring down the big bad dragon. A huge shoutout to our healing core who carried us through the final 10%.
      </p>
    </NewsTextCard>

    <NewsImageGallery 
      :columns="2"
      :images="[
        { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', caption: 'Phase 1 positioning' },
        { url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2070&auto=format&fit=crop', caption: 'The final push' },
        { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop', caption: 'Loot drops' }
      ]"
    />

    <NewsCallToAction 
      heading="Want to raid with us?" 
      text="We're currently recruiting exceptional ranged DPS to bolster our core team."
      buttonLabel="Apply Now"
      buttonLink="/roster"
      color="bg-pink-400"
    />
  </div>
</template>
