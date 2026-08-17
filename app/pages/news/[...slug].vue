<script setup lang="ts">
const route = useRoute();

const { data: post } = await useAsyncData(`news-${route.path}`, () =>
  queryCollection("news").path(route.path).first(),
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

const seoTitle = post.value.seo?.title || post.value.title || undefined;
const seoDescription =
  post.value.seo?.description || post.value.description || undefined;
const seoImage = post.value.seo?.image || post.value.image?.src || undefined;

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: seoImage,
});
</script>

<template>
  <div class="min-h-screen pb-24 relative z-10">
    <div v-if="post" class="pt-40 md:pt-52 px-4">
      <article class="max-w-4xl mx-auto flex flex-col gap-16">
        <div class="space-y-6">
          <!-- Back link -->
          <NuxtLink
            to="/news"
            class="inline-flex items-center gap-2 font-black uppercase text-sm text-gray-400 hover:text-pink-400 hover:underline transition-colors"
          >
            <UIcon name="i-lucide-arrow-left" class="w-5 h-5" />
            Back to News
          </NuxtLink>

          <NewsHero
            :title="post.title || 'Untitled'"
            :date="formatDate(post.updatedAt || post.date)"
            :original-date="formatDate(post.date)"
            :image="post.image?.src || undefined"
            :image-alt="post.image?.alt || post.title || ''"
            :tag="post.category || undefined"
            :author="post.author || undefined"
          />
        </div>

        <ContentRenderer :value="post" class="flex flex-col gap-16" />

        <!-- Back to news -->
        <div class="mt-8 pt-8 border-t-4 border-black">
          <NuxtLink
            to="/news"
            class="inline-flex items-center gap-2 bg-white text-black font-black uppercase px-6 py-3 border-4 border-black hover:bg-pink-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <UIcon name="i-lucide-arrow-left" class="w-5 h-5" />
            All News
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>
