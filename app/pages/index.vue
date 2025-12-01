<template>
  <UContainer class="py-24 sm:py-32 md:py-20 relative">
    <div class="space-y-16 md:space-y-24 lg:space-y-14">
      <!-- <HomeHeroSection /> -->
      <UPageHero orientation="horizontal" image="/Anduin.jpg" headline="100% Fun, 100% Friends, 20% Brains">
        <template #title>
          <h2 class="text-6xl font-bold max-w-xl leading-16">The <span class="text-pink-500">Friendliest</span>
            Guild on
            US-Illidan</h2>
        </template>
        <template #description>
          <p class="font-mono text-neutral-500">We’re a fun, friendly, and inclusive World of Warcraft guild on the
            US-Illidan
            server!
            Our diverse group
            of friends has been adventuring together for years, and we’re always excited to welcome new members.
            We're currently raiding in The War Within and would love for you to join our ranks — whether you're
            a
            seasoned raider or just looking for a chill group to hang out with. Come be part of our community
            and
            share in the adventure!</p>
        </template>
        <template #links>
          <UButton color="primary" variant="solid" size="xl" @click="useJoinModal().open()"
            class="cursor-pointer shadow-md">
            Join Us
          </UButton>
        </template>
        <img src="/Anduin%20Background%20Removed.png" alt="App screenshot" />
      </UPageHero>
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

const { data: posts } = await useAsyncData('blog', () => queryCollection('content').all())
</script>
