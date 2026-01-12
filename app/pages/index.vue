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
         <section class="space-y-12">
           <!-- Section Header -->
           <div class="text-center space-y-3">
              <h2 class="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight">What Makes Us Unique</h2>
              <p class="text-gray-500 font-medium text-lg">More than just a guild, we're a family</p>
           </div>
           <HomeBentoGrid />
         </section>
       </UContainer>


      <!-- Guild News Section -->
      <UContainer>
        <section class="space-y-12">
          <!-- Section Header -->
          <div class="flex items-center gap-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-black bg-orange-100 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <UIcon name="i-lucide-scroll-text" class="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 class="font-heading font-black text-4xl md:text-5xl uppercase tracking-tight">Guild News</h2>
              <p class="text-gray-500 font-medium text-lg mt-1">The latest from our cozy corner</p>
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
