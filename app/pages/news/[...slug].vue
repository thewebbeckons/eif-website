<script setup lang="ts">
const route = useRoute();

const { data: post } = await useAsyncData(`news-${route.path}`, () =>
  queryCollection("news").where("path", "=", route.path).first(),
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

const formatDate = (date?: string | Date | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.image,
});
</script>

<template>
  <div class="min-h-screen pb-24 relative z-10">
    <div v-if="post" class="pt-40 md:pt-52 px-4">
      <article class="max-w-4xl mx-auto">
        <!-- Back link -->
        <NuxtLink
          to="/news"
          class="inline-flex items-center gap-2 font-black uppercase text-sm text-gray-400 hover:text-pink-400 transition-colors mb-12"
        >
          <UIcon name="i-lucide-arrow-left" class="w-5 h-5" />
          Back to News
        </NuxtLink>

        <NewsHero
          :title="post.title"
          :date="formatDate(post.date)"
          :image="post.image"
          :image-alt="post.title"
          :tag="post.tag"
        />

        <!-- Post Body -->
        <div
          class="mt-8 prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:text-white prose-a:text-pink-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white bg-zinc-800 border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <ContentRenderer :value="post" />
        </div>

        <!-- Back to news -->
        <div class="mt-16 pt-8 border-t-4 border-black">
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

<style scoped>
.style-text-shadow {
  text-shadow: 4px 4px 0px rgba(168, 85, 247, 1);
}
</style>
