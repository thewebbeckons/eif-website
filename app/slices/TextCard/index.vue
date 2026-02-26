<script setup lang="ts">
import type { Content } from "@prismicio/client";
import NewsTextCard from "~/components/news/NewsTextCard.vue";

const props = defineProps(getSliceComponentProps<Content.ChapterIntroSlice>());
</script>

<template>
  <section
    :data-slice-type="props.slice.slice_type"
    :data-slice-variation="props.slice.variation"
  >
    <NewsTextCard
      :variant="
        props.slice.variation === 'textCardHighlight' ? 'highlight' : 'default'
      "
    >
      <CustomPrismicRichText :field="props.slice.primary.body" />
    </NewsTextCard>
  </section>
</template>
