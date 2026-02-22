<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  sectionClass?: string
  headingClass?: string
  descriptionClass?: string
  cardClass?: string
  limit?: number
}>(), {
  title: 'Guild News',
  description: 'The latest from our cozy corner',
  sectionClass: '',
  headingClass: 'text-gray-900 dark:text-stone-100',
  descriptionClass: 'text-gray-500 dark:text-stone-400',
  cardClass: '',
  limit: 3,
})

const { data: posts } = await useAsyncData(() => queryCollection('content').all())

const visiblePosts = computed(() => {
  return (posts.value ?? []).slice(0, props.limit)
})
</script>

<template>
  <section :class="['space-y-12', props.sectionClass]">
    <div class="text-center space-y-3">
      <h2 :class="['font-heading font-black text-4xl md:text-5xl uppercase tracking-tight', props.headingClass]">
        {{ props.title }}
      </h2>
      <p :class="['font-medium text-lg', props.descriptionClass]">
        {{ props.description }}
      </p>
    </div>

    <UBlogPosts>
      <UBlogPost
        v-for="post in visiblePosts"
        :key="post.id"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :image="post.image"
        :to="post.path"
        :class="props.cardClass"
      />
    </UBlogPosts>
  </section>
</template>
