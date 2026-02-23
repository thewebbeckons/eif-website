<script setup lang="ts">
import NewsHero from '~/components/news/NewsHero.vue'
import NewsQuote from '~/components/news/NewsQuote.vue'
import NewsTextCard from '~/components/news/NewsTextCard.vue'
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 pt-40 md:pt-52 pb-24 relative z-10 min-h-screen flex flex-col gap-12 md:gap-16">
    <NewsHero 
      title="The Ninja Looter Incident" 
      date="September 15, 2024" 
      tag="Guild Drama"
      image="https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=2070&auto=format&fit=crop"
    />
    
    <NewsQuote 
      quote="It was an accident, I swear I thought it was a greed roll!" 
      author="Anonymous Rogue" 
    />

    <NewsTextCard>
      <h2>A Dark Day in the Guild</h2>
      <p>
        We need to address the elephant in the room regarding last Tuesday's alt run. 
        While we encourage a relaxed atmosphere during non-progression nights, ninja looting the highly coveted 
        trinket is where we draw the line. 
      </p>
      <p>
        The offending party has been benched for two weeks and stripped of their loot council priority. 
        Let this be a lesson that the guild master's watchful eyes miss nothing.
      </p>
    </NewsTextCard>

    <NewsQuote 
      quote="I don't even play that spec, I just wanted the transmog." 
      author="The Same Rogue" 
    />
  </div>
</template>
