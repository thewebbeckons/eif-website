// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@nuxt/ui", "@nuxt/content", "@nuxt/scripts"],
	css: ["~/assets/css/main.css"],
	devtools: { enabled: true },
	compatibilityDate: "2026-11-01",

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
		// Required: workerd's native node:console exposes console.createTask but
		// throws ERR_METHOD_NOT_IMPLEMENTED when it is called. Nuxt's hookable
		// calls it whenever it exists, which 500s every SSR/API route. The unenv
		// console omits createTask, so hookable falls back. Re-test before removing.
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
			ignore: ["/roster", "/streams", "/api", "/account", "/recruitment"],
			autoSubfolderIndex: false,
		},
		cloudflare: {
			deployConfig: true,
			wrangler: {
				name: "eif-website",
				triggers: {
					crons: ["0 9 * * *"],
				},
				// The KV and D1 bindings live in wrangler.jsonc, which Nitro merges
				// into this config at build time and `nuxt dev` reads for local
				// emulation. Declaring a binding in both places would duplicate it.
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
		// Discord sign-in: NUXT_DISCORD_CLIENT_ID, NUXT_DISCORD_CLIENT_SECRET,
		// NUXT_DISCORD_GUILD_ID and NUXT_SESSION_PASSWORD (32+ characters), or the
		// same names without the NUXT_ prefix as Worker secrets.
		discordClientId: "",
		discordClientSecret: "",
		discordGuildId: "",
		sessionPassword: "",
	},
});
