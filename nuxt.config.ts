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
		alias: {
			"node:console": "unenv/node/console",
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
		raiderIoKey: process.env.RAIDER_IO_KEY,
		twitchClientId: process.env.TWITCH_CLIENT_ID,
		twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
	},
});
