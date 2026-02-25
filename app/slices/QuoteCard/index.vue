<script setup lang="ts">
import { asText } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import NewsQuote from "~/components/news/NewsQuote.vue";

const props = defineProps(getSliceComponentProps<Content.TestimonialSlice>());
</script>

<template>
  <section
    :data-slice-type="props.slice.slice_type"
    :data-slice-variation="props.slice.variation"
  >
    <NewsQuote
      :quote="asText(props.slice.primary.quote) || ''"
      :author="props.slice.primary.author_name || undefined"
      :role="props.slice.primary.author_title || undefined"
    />
  </section>
</template>
