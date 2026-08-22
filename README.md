# EIF Website

A World of Warcraft guild website for **Exercise in Futility** on US-Illidan.

Built with [Nuxt 4](https://nuxt.com), [Nuxt UI v4](https://ui.nuxt.com), and deployed on [Cloudflare Workers](https://workers.cloudflare.com/).

## Features

- 🏰 **Guild Roster** - Raider.IO snapshots served with a 10-minute stale-while-revalidate cache
- 📰 **News & Updates** - Markdown-powered blog via Nuxt Content
- 🏆 **Hall of Fame** - Champion team and Mythic+ Guru for each completed season
- 🎮 **Streams** - Guild member streaming status
- 📝 **Guild Applications** - Join request form

## Tech Stack

- **Framework**: Nuxt 4
- **Hosting**: Cloudflare Workers
- **UI**: Nuxt UI v4 + Tailwind CSS
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

This project targets **Cloudflare Workers**, not Cloudflare Pages. The roster route (`/api/roster`) fetches live from Raider.IO and caches its response in-process for 10 minutes with stale-while-revalidate, via Nitro's `defineCachedEventHandler` — no external storage or scheduled task required.

### 1. Create Cloudflare resources

- Create a Cloudflare Workers project connected to this repository.

### 2. Configure environment variables

Set `RAIDER_IO_KEY` in Cloudflare Workers Builds.

### 3. Build configuration

- Production builds can use `pnpm build` on Cloudflare, where Nuxt/Nitro will detect the Workers target automatically.
- For local manual Workers builds, use `pnpm build:worker`.
- If you deploy with Wrangler, deploy from `.output` so it uses the generated Worker config: `pnpm deploy`.

### 4. Local development

`pnpm dev` works without any Cloudflare bindings — the roster page fetches live from Raider.IO on each cache miss.

### 5. Roster cat tooltips

Cat ownership is managed in `app/assets/cats.json`, keyed by the stable player IDs
from `server/assets/roster.json`. Each entry's `catNames` array is shown from the
cat icon beside that player in every roster view.

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

### Hall of Fame

Completed seasons live in `server/assets/hall-of-fame.json` and are served by
`/api/hall-of-fame`. Each entry records the season's champion team and its
highest-scoring player under `mythicPlusGuru`; a Guru uses the same fields as a
team member plus `score`. A team or Guru `score` may be `null` when the final
number isn't known, and `mythicPlusGuru` may be `null` for older seasons.

Set `activeSeason` to `{ "name": ..., "description": ... }` while a season is
still running, then set it back to `null` and prepend the finished season to
`seasons` once it closes. The file is snapshot data on purpose — it keeps
historical rosters intact when `server/assets/roster.json` changes.

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
│   ├── news/       # News post building blocks (also usable from markdown)
│   └── roster/     # Roster view building blocks (CatTooltip)
├── composables/    # Shared state (useJoinModal)
├── pages/          # Route pages
├── utils/          # Auto-imported helpers
└── assets/         # Global styles plus checked-in site data (cats, qisms)
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
