<script setup lang="ts">
import type { RichTextField, RTImageNode } from "@prismicio/client";
import {
  PrismicRichText as BasePrismicRichText,
  type RichTextComponentProps,
  type RichTextComponents,
} from "@prismicio/vue";
import { NuxtLink } from "#components";

defineProps<{
  field: RichTextField | null | undefined;
}>();

const customComponents = {
  image: ({ node }: RichTextComponentProps<RTImageNode>) => {
    const image = h("img", { src: node.url, alt: node.alt || "" });

    if (node.linkTo && "url" in node.linkTo && node.linkTo.url) {
      const isExternal = node.linkTo.url.startsWith("http");

      return h(
        NuxtLink,
        {
          to: node.linkTo.url,
          target:
            ("target" in node.linkTo ? node.linkTo.target : undefined) ||
            (isExternal ? "_blank" : undefined),
          rel: isExternal ? "noreferrer" : undefined,
          class: "block transition-opacity hover:opacity-90",
        },
        () => image,
      );
    }

    return image;
  },
} satisfies RichTextComponents;
</script>

<template>
  <BasePrismicRichText
    v-if="field"
    :field="field"
    :components="customComponents"
  />
</template>
