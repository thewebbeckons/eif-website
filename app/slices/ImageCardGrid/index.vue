<script setup lang="ts">
import { asText } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import NewsImageGallery from "~/components/news/NewsImageGallery.vue";
import { computed } from "vue";

const props = defineProps(getSliceComponentProps<Content.ImageCardGridSlice>());

const images = computed(() => {
  const cards = props.slice.primary.cards ?? [];

  return cards
    .map((card) => ({
      url: card.image?.url || "",
      alt: card.image?.alt || undefined,
      caption: asText(card.title) || undefined,
    }))
    .filter((img) => Boolean(img.url));
});
</script>

<template>
  <section
    :data-slice-type="props.slice.slice_type"
    :data-slice-variation="props.slice.variation"
  >
    <NewsImageGallery :images="images" />
  </section>
</template>
