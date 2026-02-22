<script setup lang="ts">
import { Motion } from "motion-v";

const { data: posts } = await useAsyncData('blog', () => queryCollection('content').all())
</script>
<template>

  <div class="relative">
    <div class="space-y-32 md:space-y-40">
      <HomeHeroSection />
       <!-- Bento Grid Section -->
       <UContainer>
         <section class="space-y-12 pt-20 md:pt-0">
           <!-- Section Header -->
           <div class="text-center space-y-3">
              <h2 class="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight text-gray-900 dark:text-stone-100">
                What Makes Us <span class="relative inline-block"><span class="relative z-10">Unique</span><span class="absolute -bottom-1 left-0 right-0 h-4 md:h-5 bg-mage-blue/30 dark:bg-mage-blue/20 rotate-[-0.5deg] rounded-sm" /></span>
              </h2>
              <p class="text-gray-500 dark:text-stone-400 font-medium text-lg">More than just a guild, we're a family</p>
           </div>
           <HomeBentoGrid />
         </section>
       </UContainer>


      <!-- Guild News Section -->
      <UContainer class="mb-20 md:mb-24 lg:mb-32">
        <section class="space-y-12">
          <!-- Section Header -->
          <div class="flex items-center gap-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-black dark:border-stone-600 bg-orange-100 dark:bg-orange-950/40 shadow-md">
              <UIcon name="i-lucide-scroll-text" class="w-8 h-8 text-black dark:text-stone-100" />
            </div>
            <div>
              <h2 class="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight text-gray-900 dark:text-stone-100">Guild News</h2>
              <p class="text-gray-500 dark:text-stone-400 font-medium text-lg mt-1">The latest from our cozy corner</p>
            </div>
          </div>

          <!-- Blog Posts Grid -->
          <UBlogPosts>
            <UBlogPost v-for="post in posts" :key="post.id" :title="post.title" :description="post.description"
              :date="post.date" :image="post.image" :to="post.path" />
          </UBlogPosts>
        </section>
      </UContainer>
    </div>
  </div>
</template>
