<script setup lang="ts">
import { components } from "~/slices";

const prismic = usePrismic();
const route = useRoute();

// Extract UID from the catch-all route
const uid = computed(() => {
  const parts = route.params.uid;
  if (Array.isArray(parts)) return parts.join("/");
  return parts || "";
});

const { data: post } = await useAsyncData(`news-${uid.value}`, () =>
  prismic.client.getByUID("news", uid.value),
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

const formatDate = (date?: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const seoTitle =
  post.value.data.meta_title || post.value.data.title || undefined;
const seoDescription =
  post.value.data.meta_description || post.value.data.description || undefined;
const seoImage =
  post.value.data.meta_image?.url || post.value.data.image?.url || undefined;

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
            class="inline-flex items-center gap-2 font-black uppercase text-sm text-gray-400 hover:text-pink-400 transition-colors"
          >
            <UIcon name="i-lucide-arrow-left" class="w-5 h-5" />
            Back to News
          </NuxtLink>

          <NewsHero
            :title="post.data.title || 'Untitled'"
            :date="formatDate(post.last_publication_date)"
            :image="post.data.image?.url || undefined"
            :image-alt="post.data.title || ''"
            :tag="post.data.category || undefined"
          />
        </div>

        <SliceZone :slices="post.data.slices" :components="components" />

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
