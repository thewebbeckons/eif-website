# EIF Website

A World of Warcraft guild website for **Exercise in Futility** on US-Illidan.

Built with [Nuxt 4](https://nuxt.com), [Nuxt UI v4](https://ui.nuxt.com), and deployed on [Cloudflare Workers](https://workers.cloudflare.com/).

## Features

- 🏰 **Guild Roster** - Raider.IO snapshots cached in NuxtHub KV and served instantly
- 📰 **News & Updates** - Markdown-powered blog via Nuxt Content
- 🎮 **Streams** - Guild member streaming status
- 📝 **Guild Applications** - Join request form

## Tech Stack

- **Framework**: Nuxt 4
- **Hosting**: Cloudflare Workers
- **UI**: Nuxt UI v4 + Tailwind CSS
- **Storage**: NuxtHub KV
- **CMS**: Nuxt Content (markdown + YAML in `content/`)
- **Animations**: motion-v
- **Validation**: zod
- **Package Manager**: pnpm

## Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Build a Cloudflare Worker artifact
pnpm build:worker

# Preview the built Worker locally
pnpm preview:worker

# Deploy the built Worker
pnpm deploy

# Preview production build
pnpm preview
```

## Cloudflare Workers Deployment

This project targets **Cloudflare Workers**, not Cloudflare Pages. The roster cache uses [NuxtHub KV](https://hub.nuxt.com) and a Nitro scheduled task that refreshes Raider.IO data every 10 minutes in production.

### 1. Create Cloudflare resources

- Create one Workers KV namespace for production.
- Create one Workers KV namespace for preview deployments.
- Create a Cloudflare Workers project connected to this repository.

### 2. Configure environment variables

Set these variables in Cloudflare Workers Builds for both environments:

- `RAIDER_IO_KEY`
- `CLOUDFLARE_KV_NAMESPACE_ID`

Use the production namespace ID in the production environment and the preview namespace ID in the preview environment.

NuxtHub's `hub:kv` runtime expects a Cloudflare binding named `KV`. When `CLOUDFLARE_KV_NAMESPACE_ID` is present during a worker build, Nuxt/Nitro generates that binding in `.output/server/wrangler.json`.

### 3. Build configuration

- Production builds can use `pnpm build` on Cloudflare, where Nuxt/Nitro will detect the Workers target automatically.
- For local manual Workers builds, use `pnpm build:worker`.
- To build preview bindings locally, also set `CLOUDFLARE_ENV=preview`.
- If you deploy with Wrangler, deploy from `.output` so it uses the generated Worker config: `pnpm deploy`.
- If you deploy from the Cloudflare dashboard instead, confirm the deployed worker has a KV namespace bound with the exact binding name `KV`.

### 4. Cron trigger

The Worker cron is generated at build time from [nuxt.config.ts](./nuxt.config.ts) and runs every 10 minutes in production:

```txt
*/10 * * * *
```

Preview builds should set `CLOUDFLARE_ENV=preview`, which disables the cron trigger in the generated Worker config while still keeping the preview KV binding.

### 5. Local development

- `pnpm dev` uses NuxtHub local storage under `.data/` for KV.
- Remote Cloudflare bindings are optional for development and are not required for the roster page to work locally.

## Content

All editable content lives in `content/` and is read through [Nuxt Content](https://content.nuxt.com). Schemas are defined in [content.config.ts](./content.config.ts).

- `content/news/*.md` — one markdown file per news post. Frontmatter carries the
  title, description, cover image, category, author, `date`/`updatedAt`
  (`YYYY-MM-DD` strings) and optional `seo` overrides.
- `content/home.yml` — the homepage hero blurb and recruitment role tiles.

Post bodies are plain markdown plus [MDC](https://content.nuxt.com/docs/files/markdown#mdc-syntax)
blocks for the richer layouts. The components under `app/components/news/` are
registered globally so they can be used directly in markdown:

```md
::news-text-card{variant="highlight"}
Regular **markdown** inside a highlighted card.
::

::news-quote{quote="We are NOT ready for this raid tier." author="Qbeans" role="Guild Master"}
::

::news-call-to-action{heading="Ready to raid?" button-label="Drop an App" button-link="/apply"}
::

::news-image-gallery
---
columns: 3
images:
  - url: /images/news/example.jpg
    alt: Example
    caption: Example caption
---
::
```

Streamer handles live in `server/assets/streamers.json` — they're read by the
Twitch API route on the server, so they stay plain JSON rather than a content
collection.

### Publishing

`/`, `/news` and every `/news/<slug>` route are **prerendered at build time**
(see `nitro.prerender` in [nuxt.config.ts](./nuxt.config.ts)), so the deployed
Worker serves them as static assets and never needs a content database at
runtime. Publishing a post therefore means committing the markdown and
redeploying.

If you'd rather query content at runtime (for drafts, or to avoid a rebuild per
post), Nuxt Content on Cloudflare requires a D1 database bound as `DB`; create
one with `wrangler d1 create` and add a `d1_databases` entry alongside the
existing bindings in `nitro.cloudflare.wrangler`.

## Project Structure

```
app/
├── components/
│   ├── app/        # Global components (Header, Footer, Logo, JoinModal)
│   ├── home/       # Homepage sections
│   └── news/       # News post building blocks (also usable from markdown)
├── composables/    # Shared state (useJoinModal)
├── pages/          # Route pages
├── utils/          # Auto-imported helpers
└── assets/css/     # Global styles
content/
├── news/           # Markdown blog posts
└── home.yml        # Homepage copy and recruitment roles
public/             # Static assets
server/             # Server routes, tasks, and utilities
```

## External APIs

- **Raider.io** - Guild roster and Mythic+ data
- **Twitch** - Streaming status (planned)

## License

MIT
