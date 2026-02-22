<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { PrismicRichText, PrismicImage } from "@prismicio/vue";

defineProps(getSliceComponentProps<Content.WhyChooseUsSlice>());
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <PrismicRichText :field="slice.primary.heading" />

    <PrismicRichText :field="slice.primary.tagline" />

    <div>
      <div v-for="card in slice.primary.cards" :key="card">
        <div>
          <div v-if="card.badge">
            {{ card.badge }}
          </div>

          {{ card.title }}

          <PrismicRichText :field="card.description" />

          <PrismicImage v-if="card.cardImage" :field="card.cardImage" />
        </div>
      </div>
    </div>
  </section>
</template>
