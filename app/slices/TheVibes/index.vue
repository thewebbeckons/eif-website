<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/vue";

const { slice } = defineProps(getSliceComponentProps<Content.TheVibesSlice>());
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div v-if="slice.primary.tag">
      {{ slice.primary.tag }}
    </div>

    <PrismicRichText :field="slice.primary.heading" />

    <PrismicRichText :field="slice.primary.description" />

    <ul v-if="slice.primary.features && slice.primary.features.length">
      <li v-for="(feature, index) in slice.primary.features" :key="index">
        {{ feature.feature_text }}
      </li>
    </ul>
  </section>
</template>
