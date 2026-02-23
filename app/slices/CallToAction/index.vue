<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { PrismicRichText, PrismicLink } from "@prismicio/vue";

const { slice } = defineProps(getSliceComponentProps<Content.CallToActionSlice>());
</script>

<template>
  <section :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation">
    <PrismicRichText :field="slice.primary.heading" />
    <PrismicLink :field="slice.primary.button_link" />
  </section>
</template>
