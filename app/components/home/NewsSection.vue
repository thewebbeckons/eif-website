<template>
  <UContainer>
    <div class="grid grid-cols-1 md:grid-cols-8 gap-8 py-12">
      <!-- Featured news item -->
      <div class="col-span-full md:col-span-5 h-full">
        <UCard variant="outline" class="h-full overflow-hidden">
          <div class="relative">
            <img src="https://placehold.co/800x400" alt="Featured news" class="w-full h-64 object-cover" />
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
              <span class="text-xs font-medium text-white bg-primary-500 rounded-full px-2 py-1">Featured</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-xl font-bold mb-2">Latest Research Breakthrough</h3>
            <p class="text-gray-500 mb-4">Our team has recently made significant progress in the field of quantum
              computing, achieving a major breakthrough that could revolutionize the industry.</p>
            <UButton size="sm" variant="soft" color="primary" class="mt-2">Read More</UButton>
          </div>
        </UCard>
      </div>

      <!-- Smaller news items -->
      <div class="col-span-full md:col-span-3 flex flex-col gap-8">
        <UCard v-for="(item, index) in newsItems" :key="index" variant="outline" class="overflow-hidden">
          <div class="flex flex-col sm:flex-row">
            <img :src="item.image" :alt="item.title" class="h-32 w-full sm:w-32 object-cover" />
            <div class="p-4">
              <h4 class="font-bold">{{ item.title }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ item.description }}</p>
              <UButton size="xs" variant="ghost" color="primary" class="mt-2">Read More</UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const newsItems = [
  {
    title: "New Partnership Announcement",
    description: "We're excited to announce our new strategic partnership with Industry Leaders Inc.",
    image: "https://placehold.co/300x200"
  },
  {
    title: "Upcoming Conference",
    description: "Join us at the annual tech summit happening next month in San Francisco.",
    image: "https://placehold.co/300x200"
  },

];
</script>

<style></style>