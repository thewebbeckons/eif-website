<script setup lang="ts">
import { asText, asLink } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { computed } from "vue";
import NewsCallToAction from "~/components/news/NewsCallToAction.vue";

const props = defineProps(getSliceComponentProps<Content.CtaBannerSlice>());

const buttonLabel = computed(() => {
  const button = props.slice.primary.button;

  if (
    button &&
    typeof button === "object" &&
    "text" in button &&
    typeof button.text === "string" &&
    button.text.trim().length > 0
  ) {
    return button.text;
  }

  return "Click here";
});
</script>

<template>
  <section
    :data-slice-type="props.slice.slice_type"
    :data-slice-variation="props.slice.variation"
  >
    <NewsCallToAction
      :heading="asText(props.slice.primary.heading) || ''"
      :text="asText(props.slice.primary.description) || undefined"
      :buttonLabel="buttonLabel"
      :buttonLink="asLink(props.slice.primary.button) || undefined"
    />
  </section>
</template>
