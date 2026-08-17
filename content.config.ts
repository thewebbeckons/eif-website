import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const image = z.object({
  src: z.string().describe("Path or URL to the image"),
  alt: z.string().optional().describe("Alt text"),
});

export default defineContentConfig({
  collections: {
    // News posts — markdown with frontmatter, rendered as pages under /news
    news: defineCollection({
      type: "page",
      source: "news/**/*.md",
      schema: z.object({
        title: z.string().describe("Post title"),
        description: z
          .string()
          .optional()
          .describe("Short summary shown in the news feed"),
        image: image.optional().describe("Cover image"),
        category: z
          .enum(["Raid", "News", "Event", "Announcement"])
          .optional()
          .describe("Category badge"),
        author: z.string().optional().describe("Post author"),
        featured: z
          .boolean()
          .default(false)
          .describe("Pin to the top of the news feed"),
        // Kept as `YYYY-MM-DD` strings rather than `z.date()`: dates are
        // calendar days, and round-tripping them through Date shifts them by a
        // day in negative UTC offsets. ISO strings also sort chronologically.
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .describe("Original publication date, YYYY-MM-DD"),
        updatedAt: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe("Last updated date, YYYY-MM-DD"),
        seo: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
            image: z.string().optional(),
          })
          .optional()
          .describe("SEO overrides"),
      }),
    }),

    // Home page — single data file for the editable bits of the landing page
    home: defineCollection({
      type: "data",
      source: "home.yml",
      schema: z.object({
        description: z.string().describe("Hero blurb"),
        roles: z
          .array(
            z.object({
              name: z.string().describe("Role name, ie. Tank"),
              icon: z.string().describe("Lucide icon name, ie. i-lucide-shield"),
              active: z.boolean().describe("Whether we're recruiting the role"),
            }),
          )
          .describe("Recruitment roles"),
      }),
    }),
  },
});
