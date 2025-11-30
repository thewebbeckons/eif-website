<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () => queryCollection('content').all())
</script>

<template>
  <UPage>
    <UPageHero title="News" />

    <UPageBody>
      <UContainer>
        <UBlogPosts>
          <UBlogPost v-for="(post, index) in posts" :key="index" v-bind="post" :to="post.path" :image="post.image"
            :date="post.date" />
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </UPage>
</template>