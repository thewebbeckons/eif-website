<script setup lang="ts">
const prismic = usePrismic();

const { data: posts, status } = await useAsyncData("news-posts", () =>
  prismic.client.getAllByType("news", {
    orderings: [{ field: "document.last_publication_date", direction: "desc" }],
  }),
);

const featuredPost = computed(
  () => posts.value?.find((p) => p.data.featured) ?? posts.value?.[0],
);
const remainingPosts = computed(
  () => posts.value?.filter((p) => p !== featuredPost.value) || [],
);

const formatDate = (date?: string | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <div class="min-h-screen pb-24 relative z-10">
    <!-- Hero Section -->
    <div class="pt-40 md:pt-52 pb-20 px-4">
      <div class="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1
          class="text-6xl md:text-8xl font-black text-stone-100 uppercase tracking-tighter mb-6 style-text-shadow"
        >
          Latest Intel
        </h1>
        <p
          class="text-xl md:text-2xl text-stone-100 font-bold max-w-2xl border-4 border-black p-4 bg-zinc-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          Stay up to date with the latest guild achievements, news, and
          degenerate activities.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 mt-8 flex flex-col gap-16">
      <!-- Loading State -->
      <div v-if="status === 'pending'" class="flex justify-center py-20">
        <UIcon
          name="i-lucide-loader-circle"
          class="w-12 h-12 text-white animate-spin"
        />
      </div>

      <!-- Featured Post -->
      <NuxtLink
        v-else-if="featuredPost"
        :to="`/news/${featuredPost.uid}`"
        class="block group"
      >
        <div
          class="grid grid-cols-1 lg:grid-cols-2 bg-zinc-800 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(168,85,247,1)] transition-all duration-200 group-hover:-translate-y-2"
        >
          <div
            class="h-64 lg:h-full border-b-4 lg:border-b-0 lg:border-r-4 border-black relative overflow-hidden bg-purple-500"
          >
            <PrismicImage
              v-if="featuredPost.data.image?.url"
              :field="featuredPost.data.image"
              :alt="featuredPost.data.image.alt || ''"
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-black font-black text-4xl opacity-50 uppercase"
            >
              No Image
            </div>

            <div
              class="absolute top-4 left-4 bg-pink-400 text-black border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Featured
            </div>

            <div
              v-if="featuredPost.data.category"
              class="absolute top-4 right-4 bg-yellow-400 text-black border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {{ featuredPost.data.category }}
            </div>
          </div>

          <div class="p-8 md:p-12 flex flex-col justify-center">
            <div
              class="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest"
            >
              {{ formatDate(featuredPost.last_publication_date) }}
            </div>
            <h2
              class="text-4xl md:text-5xl font-black text-white mb-6 leading-tight group-hover:text-purple-400 transition-colors"
            >
              {{ featuredPost.data.title || "Untitled Post" }}
            </h2>
            <p class="text-lg text-gray-300 font-medium mb-8 line-clamp-3">
              {{
                featuredPost.data.description ||
                "Click to read the full story..."
              }}
            </p>

            <div
              class="mt-auto self-start bg-white text-black font-black uppercase px-6 py-3 border-4 border-black group-hover:bg-pink-400 group-hover:text-black group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Read More
            </div>
          </div>
        </div>
      </NuxtLink>

      <!-- Grid of Remaining Posts -->
      <div
        v-if="remainingPosts.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <NuxtLink
          v-for="post in remainingPosts"
          :key="post.uid"
          :to="`/news/${post.uid}`"
          class="block group"
        >
          <div
            class="h-full flex flex-col bg-zinc-800 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0px_0px_rgba(244,114,182,1)]"
          >
            <div
              class="h-48 border-b-4 border-black relative overflow-hidden bg-emerald-400"
            >
              <PrismicImage
                v-if="post.data.image?.url"
                :field="post.data.image"
                :alt="post.data.title || ''"
                class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-black font-black text-2xl opacity-50 uppercase"
              >
                Image
              </div>

              <div
                v-if="post.data.category"
                class="absolute top-4 left-4 bg-yellow-400 text-black border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                {{ post.data.category }}
              </div>
            </div>

            <div class="p-6 flex flex-col flex-grow">
              <div
                class="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest"
              >
                {{ formatDate(post.last_publication_date) }}
              </div>
              <h3
                class="text-2xl font-black text-white mb-4 group-hover:text-pink-400 transition-colors line-clamp-2"
              >
                {{ post.data.title || "Untitled Post" }}
              </h3>
              <p class="text-gray-300 font-medium mb-6 line-clamp-3">
                {{ post.data.description || "Click to read the full story..." }}
              </p>

              <div
                class="mt-auto font-black uppercase text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform text-white group-hover:text-pink-400"
              >
                Read More <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div
        v-else-if="status === 'success' && !featuredPost"
        class="text-center py-20 font-black text-4xl text-gray-400 uppercase"
      >
        No news available yet.
      </div>
    </div>
  </div>
</template>

<style scoped>
.style-text-shadow {
  text-shadow: 4px 4px 0px rgba(168, 85, 247, 1); /* purple-500 */
}
</style>
