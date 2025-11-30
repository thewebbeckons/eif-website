<template>
  <UContainer class="py-24 sm:py-32 md:py-40 relative">
    <div class="space-y-16 md:space-y-24 lg:space-y-28">
      <HomeHeroSection />
      <HomeFeatureSection />
      <UBlogPosts>
        <UBlogPost v-for="post in posts" :key="post.id" :title="post.title" :description="post.description"
          :date="post.date" :image="post.image" :to="post.path" />
      </UBlogPosts>
    </div>
  </UContainer>
</template>
<script setup lang="ts">
import { Motion } from "motion-v";

const { data: posts } = await useAsyncData('blog', () => queryCollection('content').where('folder', '=', 'news').all())
</script>
