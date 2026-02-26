<script setup lang="ts">
import { PrismicRichText as BasePrismicRichText } from "@prismicio/vue";
import type { RichTextField } from "@prismicio/client";
import { h } from "vue";
import { NuxtLink } from "#components";

const props = defineProps<{
  field: RichTextField | null | undefined;
}>();

const customComponents = {
  image: ({ node }: { node: any }) => {
    const imgHtml = h("img", { src: node.url, alt: node.alt || "" });

    // If the image has a link attached in Prismic
    if (node.linkTo && "url" in node.linkTo) {
      const isExternal = node.linkTo.url.startsWith("http");

      return h(
        NuxtLink,
        {
          to: node.linkTo.url,
          target: node.linkTo.target || (isExternal ? "_blank" : undefined),
          class: "block hover:opacity-90 transition-opacity",
        },
        () => imgHtml,
      );
    }

    return imgHtml;
  },
};
</script>

<template>
  <BasePrismicRichText
    v-if="field"
    :field="field"
    :components="customComponents"
  />
</template>
