import { resolve } from "node:path";

import prismicConfig from "./prismic.config.json";

const rosterRefreshCron = "*/10 * * * *";
const isPreviewCloudflareEnv = process.env.CLOUDFLARE_ENV === "preview";
const isDevelopment = process.env.NODE_ENV === "development";
const isCloudflareWorkerBuild =
  process.env.NITRO_PRESET === "cloudflare_module";
const requestCoordinatorPath = resolve(
  "server/durable-objects/request-coordinator.ts",
);
const cloudflareWranglerConfig = {
  observability: {
    enabled: true,
    head_sampling_rate: 1,
    logs: {
      enabled: true,
      head_sampling_rate: 1,
      invocation_logs: true,
    },
  },
  upload_source_maps: true,
  durable_objects: {
    bindings: [
      {
        name: "REQUEST_COORDINATOR",
        class_name: "RequestCoordinator",
      },
    ],
  },
  exports: {
    RequestCoordinator: {
      type: "durable-object",
      storage: "sqlite",
    },
  },
  triggers: {
    crons: isPreviewCloudflareEnv ? [] : [rosterRefreshCron],
  },
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxtjs/prismic", "@nuxthub/core"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  compatibilityDate: "2026-07-18",

  prismic: {
    endpoint: prismicConfig.repositoryName,
    clientConfig: {
      routes: prismicConfig.routes,
    },
  },

  ui: {
    fonts: false,
  },

  colorMode: {
    preference: "dark",
    fallback: "dark",
  },
  hub: {
    kv: isDevelopment
      ? {
          driver: "fs-lite",
          base: ".data/kv",
        }
      : {
          driver: "cloudflare-kv-binding",
          namespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID,
          binding: "KV",
        },
  },
  nitro: {
    compatibilityDate: "2026-07-18",
    experimental: {
      tasks: true,
    },
    scheduledTasks: isPreviewCloudflareEnv
      ? {}
      : {
          [rosterRefreshCron]: ["roster:refresh"],
        },
    cloudflare: {
      // Nitro's bundled Wrangler types do not yet include declarative
      // Durable Object exports, but Wrangler 4.112 does.
      wrangler: cloudflareWranglerConfig,
    },
    hooks: {
      "rollup:before"(nitro, rollupConfig) {
        if (!isCloudflareWorkerBuild) return;

        const nitroEntry = nitro.options.entry;
        const workerEntry = "\0cloudflare-request-coordinator-entry";
        rollupConfig.input = workerEntry;
        rollupConfig.plugins = [
          rollupConfig.plugins || [],
          {
            name: "cloudflare-request-coordinator-export",
            resolveId(id: string) {
              return id === workerEntry ? workerEntry : null;
            },
            load(id: string) {
              if (id !== workerEntry) return null;

              return [
                `export { default } from ${JSON.stringify(nitroEntry)};`,
                `export { RequestCoordinator } from ${JSON.stringify(requestCoordinatorPath)};`,
              ].join("\n");
            },
          },
        ];
      },
    },
  },
  runtimeConfig: {
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
    raiderIoKey: process.env.RAIDER_IO_KEY,
    twitchClientId: process.env.TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
  },
});
