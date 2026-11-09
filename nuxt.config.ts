// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/ui", "@nuxt/content", "@nuxt/scripts"],
	css: ["~/assets/css/main.css"],
	devtools: { enabled: true },
	compatibilityDate: "2025-02-15",

	components: [
		// Registered globally so markdown can use them as MDC blocks (::news-quote)
		{ path: "~/components/news", global: true },
		"~/components",
	],

	content: {
		experimental: {
			nativeSqlite: true,
		},
	},

	icon: {
		clientBundle: {
			scan: {
				globInclude: ["app/**/*.{vue,ts}"],
				globExclude: ["node_modules", ".nuxt", ".output"],
			},
			icons: ["lucide:bow-arrow", "lucide:heart-pulse"],
		},
	},

	colorMode: {
		preference: "dark",
		fallback: "dark",
	},
	nitro: {
		// Required: with the current compatibility date, workerd has no native
		// node:console module and the Worker fails to boot without this alias.
		alias: {
			"node:console": "unenv/node/console",
		},
		// Back Nitro's response cache (defineCachedEventHandler) with KV so the
		// roster and streams caches survive across Worker isolates instead of
		// living in per-isolate memory.
		storage: {
			cache: {
				driver: "cloudflare-kv-binding",
				binding: "EIF_KV",
				base: "nitro-cache",
			},
		},
		devStorage: {
			cache: { driver: "fs", base: ".data/cache" },
		},
		prerender: {
			// Content-backed routes are baked at build time so the Worker never needs
			// a runtime content database. Crawling picks up each /news/<slug> post
			// from the news index. /hall-of-fame reads a committed JSON file, so it
			// bakes too rather than hitting the API at runtime.
			crawlLinks: true,
			routes: ["/", "/news", "/hall-of-fame"],
			ignore: ["/roster", "/streams", "/apply", "/api"],
			autoSubfolderIndex: false,
		},
		cloudflare: {
			deployConfig: true,
			wrangler: {
				name: "eif-website",
				triggers: {
					crons: ["0 9 * * *"],
				},
				kv_namespaces: [
					{
						binding: "EIF_KV",
						id: "3547fd67ed2f482995666644d58d08bf",
					},
				],
				compatibility_flags: ["nodejs_compat"],
				observability: {
					enabled: true,
					logs: {
						enabled: true,
						invocation_logs: true,
						head_sampling_rate: 1,
					},
				},
			},
		},
	},
	runtimeConfig: {
		// Filled at runtime from NUXT_TWITCH_CLIENT_ID / NUXT_TWITCH_CLIENT_SECRET
		// (or the TWITCH_* Worker bindings read in server/api/streams.get.ts).
		// Reading process.env here would inline build-machine values into the bundle.
		twitchClientId: "",
		twitchClientSecret: "",
	},
});
