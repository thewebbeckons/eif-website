import { defineCollection, defineContentConfig } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
  collections: {
    // News posts — markdown with frontmatter, rendered as pages
    news: defineCollection({
      type: "page",
      source: "news/**/*.md",
      schema: z.object({
        title: z.string().describe("Post title"),
        description: z.string().describe("Brief summary for cards and SEO"),
        image: z.string().optional().describe("Cover image URL"),
        date: z.date().describe("Publication date"),
        tag: z.string().optional().describe("Tag for the post"),
        featured: z.boolean().default(false).describe("Pin as featured post"),
      }),
    }),

    // Streamers — single JSON data file managed via Nuxt Studio
    streamers: defineCollection({
      type: "data",
      source: "streamers.json",
      schema: z.object({
        streamers: z.array(
          z.object({
            displayName: z.string().describe("Display name"),
            twitchUser: z.string().describe("Twitch username"),
          }),
        ),
      }),
    }),
  },
});
