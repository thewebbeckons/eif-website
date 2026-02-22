<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { PrismicRichText, PrismicLink } from "@prismicio/vue";

const { slice } = defineProps(getSliceComponentProps<Content.GuildHeroSlice>());
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <PrismicRichText :field="slice.primary.heading" />
    <PrismicRichText :field="slice.primary.description" />
    <PrismicLink :field="slice.primary.cta_button" />
    <p>{{ slice.primary.loot_item_name }}</p>
    <p>{{ slice.primary.looted_by }}</p>
  </section>
</template>
