<script setup lang="ts">
import NewsHero from '~/components/news/NewsHero.vue'
import NewsTextCard from '~/components/news/NewsTextCard.vue'
import NewsQuote from '~/components/news/NewsQuote.vue'
import NewsImageGallery from '~/components/news/NewsImageGallery.vue'
import NewsCallToAction from '~/components/news/NewsCallToAction.vue'
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 pt-40 md:pt-52 pb-24 relative z-10 min-h-screen flex flex-col gap-12 md:gap-16">
    <NewsHero 
      title="Patch 11.0 Survival Guide" 
      date="July 14, 2024" 
      tag="Guide"
      image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
    />
    
    <NewsTextCard>
      <h2>What You Need to Know</h2>
      <p>
        Patch 11.0 drops next week and brings massive changes to class balance, secondary stat scaling, 
        and crafting. The guild bank will be providing basic consumables for the first two weeks of the new season, 
        but after that, you're on your own!
      </p>
      <p>
        Make sure you've watched the raid guides posted in Discord. Officers will be testing mechanics knowledge 
        during the first clear.
      </p>
    </NewsTextCard>

    <NewsImageGallery 
      :columns="2"
      :images="[
        { url: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2070&auto=format&fit=crop', caption: 'New Zone Overview' },
        { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', caption: 'New Tier Sets' }
      ]"
    />

    <NewsQuote 
      quote="If you don't use your healthstones, I'm letting you die." 
      author="Holy Priest #4" 
    />

    <NewsTextCard variant="highlight">
      <h2>Addon Updates</h2>
      <p>
        <strong>Required addons for raiding:</strong> DBM/BigWigs, WeakAuras, and Details. 
        Please make sure they are updated before raid time. We will be doing an addon check at 7:45 PM server bounds.
      </p>
    </NewsTextCard>

    <NewsCallToAction 
      heading="View the full changelog" 
      buttonLabel="Read Notes"
      buttonLink="#"
      color="bg-purple-500"
    />
  </div>
</template>
