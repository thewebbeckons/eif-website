# Exercise in Futility (EIF) Website

A premium, highly interactive World of Warcraft guild website for **Exercise in Futility** on US-Illidan.

Built with **Nuxt 4**, **Nuxt UI v4**, **NuxtHub**, **Prismic CMS**, and styled using a custom, high-contrast **Neo-Brutalist** design system.

---

## 🎨 Design System & Aesthetics
This site rejects generic templates in favor of a bold, premium **Neo-Brutalist** aesthetic.
- **Visuals**: Dark mode by default, utilizing vibrant, custom primary (`violet`) and neutral (`stone`) color schemes.
- **Brutalist Accents**: Chunky `4px` black borders, flat heavy drop-shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`), and intentional `-skew-x-6` offsets.
- **Micro-Animations**: Custom hover and focus states configured globally in `app.config.ts`. Buttons and inputs dynamically shift on click (`active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`) for tactile physical responsiveness.
- **Interactive Layers**: A canvas-based floating particle background (`InteractiveBackground.vue`) adds subtle depth and movement without cluttering the screen.

---

## ⚡ Tech Stack & Integrations

- **Framework**: [Nuxt 4](https://nuxt.com) (using the new `app/` directory layout)
- **UI Library**: [Nuxt UI v4](https://ui.nuxt.com)
- **Hosting & Infrastructure**: [Cloudflare Workers](https://workers.cloudflare.com/) (using Nitro cloud presets)
- **State & KV Caching**: [NuxtHub KV](https://hub.nuxt.com)
- **CMS**: [Prismic CMS](https://prismic.io/) with the cloud Type Builder and Prismic CLI
- **Animations**: [motion-v](https://motion.vuejs.org/)
- **Validation**: [Zod](https://zod.dev)
- **External Integrations**:
  - **Raider.io API**: Fetches active guild progression and character Mythic+ statistics.
  - **Twitch Helix API**: Tracks real-time streaming status, game categories, viewer counts, and custom profile assets.
  - **Discord Webhooks**: Forwards guild application submissions to an officer-facing Discord channel with rich embeds.
  - **Vercel AI SDK**: Powering local generative pipelines (Gemini) to seed humorous content.

---

## 🚀 Core Features

### 🏰 1. Guild Roster & Mythic+ Teams (`/roster`)
- **Raider.io Integration**: Serves instant guild listings with Mythic+ scores, dungeon-run grids with backgrounds, and official WoW class coloring.
- **Resilient Refreshes**: Stores snapshots in NuxtHub KV and refreshes every 10 minutes with bounded Raider.io concurrency, retries, degraded-run detection, and structured lifecycle logs.
- **Roster & Team Modes**: Toggle between a flat global list and custom-defined Mythic+ groups (e.g., *Potatoad Potahtoad*, *Nerf Bear*, *Campbell's Angels*), rendering calculated average team scores.
- **Guru Tagging**: Custom indicator popovers for recognized Mythic+ gurus (detected by character prefix names).

### 📰 2. Latest Intel News Hub (`/news`)
- **Prismic CMS Integration**: A modern, structured publication flow utilizing Prismic slices (`CtaBanner`, `ImageCardGrid`, `QuoteCard`, `TextCard`).
- **Dynamic Routing**: Features a clean catch-all single route (`/news/[...uid].vue`) with a brutalist featured post block and grid layouts.
- **Full SEO Optimization**: Evaluates Prismic meta data (titles, descriptions, ogImages) to auto-inject high-quality metadata via `useSeoMeta`.
- **Preview Support**: Integrates `news/preview.vue` to preview drafts in real-time before releasing them to the public.

### 🎮 3. Live Streams Directory (`/streams`)
- **Streamer Database**: Streamer names are populated dynamically in Prismic CMS under the `streamers` type.
- **Twitch Helix Merging**: A Nitro API route (`/api/streams`) automatically handles Twitch OAuth app tokens, queries active stream data, and maps profile picture assets and offline banners.
- **Live/Offline Grid**: Displays a responsive grid of Live Now streams (detailing viewers, game tags, and streams) followed by offline channels.

### 🏆 4. Hall of Fame (`/hall-of-fame`)
- **Season Archive**: Preserves each season's top Mythic+ team in a responsive, neo-brutalist champion archive.
- **Prismic Ready**: Reads the singleton `hall_of_fame` page and its `champion_season` slices from Prismic, with the checked-in seed data as a safe fallback until the first document is published.

### 📝 5. Discord-bound Guild Applications
- **Global Recruitment Modal**: Triggered via `JoinModal.vue` through `useJoinModal()` composables.
- **Validation & Rate Limits**: Validated with **Zod** and protected by a hashed, distributed NuxtHub KV rate limit.
- **Rich Embed Deliveries**: Converts applicant logs (Character Name, Server, Discord Tag, and Message) into beautiful rich purple embeds forwarded via Discord Webhook.

### 🤖 6. Snarky Wipe Wisdom Generator
- **AI Raid Leader**: Click the Sparkles button in the Hero area to trigger a diagnostic modal containing snarky, philosophical, and unhinged quotes about wiping on WoW bosses.
- **Retro Typing Effect**: Outputs response streams with a customized typewriter animation and a blinking retro cursor.
- **Generative Seeding**: Backed by `scripts/generate-wisdom.ts`, which stays outside the production Worker bundle.

---

## 📁 Project Structure

```
├── app/
│   ├── assets/css/         # Global brutalist styles & custom text strokes
│   ├── components/
│   │   ├── app/            # Global Header, Footer, Logo, JoinModal
│   │   ├── hall-of-fame/   # Season archive presentation
│   │   ├── home/           # Homepage Bento elements, LootCard, DetailsCard
│   │   ├── news/           # Latest Intel News visual components
│   │   ├── prismic/        # Shared Prismic renderers
│   │   └── streams/        # StreamCard and Twitch indicators
│   ├── composables/        # Shared state helpers (useJoinModal, etc.)
│   ├── pages/
│   │   ├── news/           # News landing list and catches ([...uid].vue)
│   │   ├── index.vue       # Home Bento layout
│   │   ├── hall-of-fame.vue # Prismic-backed season archive
│   │   ├── roster.vue      # Raider.io Roster & Mythic+ Teams
│   │   ├── streams.vue     # Twitch live streamers
│   │   └── slice-simulator.vue # Local Prismic slice playground
│   ├── slices/             # Prismic Custom Slice templates
│   ├── app.config.ts       # Global Nuxt UI v4 theme & button customizations
│   └── app.vue             # Core wrapper & particle canvas loader
├── customtypes/            # Local Prismic Custom Type JSON configurations
├── public/                 # Static assets (Favicons, placeholders, SEO images)
├── server/
│   ├── api/
│   │   ├── wisdom/         # Wisdom randomized endpoint
│   │   ├── apply.post.ts   # Discord applicant webhook handler
│   │   ├── roster.get.ts   # Raider.io snapshot cache endpoint
│   │   └── streams.get.ts  # Twitch Helix API stream aggregator
│   ├── assets/             # Stored local JSON (roster definitions, wisdom)
│   ├── tasks/roster/       # Nitro cron task: refreshing Raider.io
│   └── utils/              # Roster caching and helper modules
├── scripts/                # Local-only maintenance and generation scripts
├── shared/types/           # API contracts shared by app and server
├── prismic.config.json     # Prismic CLI and Type Builder configuration
├── nuxt.config.ts          # Central modules configuration, Nitro, and bindings
└── package.json            # Scripts, dependencies, and pnpm specs
```

---

## 🛠️ Local Development

### 1. Installation
The project mandates the use of **pnpm** as its package manager.
```bash
# Install dependencies
pnpm install
```

### 2. Run the Development Server
```bash
pnpm dev
```
*Note: Development server uses NuxtHub local storage inside `.data/` for local KV bindings.*

### 3. Prismic Type Builder workflow
Content models are managed in Prismic's cloud Type Builder. Pull remote model changes and regenerate types with the Prismic CLI:
```bash
npx prismic login
pnpm prismic:pull
pnpm prismic:types
```

During active model work, `pnpm prismic:sync` watches the repository and continuously updates local models, generated types, and slice components.

The Hall of Fame integration expects a singleton page type with API ID `hall_of_fame`, text fields named `title`, `introduction`, `active_season_name`, and `active_season_description`, plus `champion_season` slices. Each slice contains `season_id`, `season_name`, `team_name`, `score`, and a `members` group with `name`, `class_name`, `specialization`, `role`, `avatar`, and `profile_url` fields.

### 4. Standalone AI Wisdom Generation
To regenerate the unhinged raid quotes in `server/assets/wisdom.json`:
```bash
# Ensure your AI Gateway credentials are available locally
pnpm wisdom:generate
```

---

## ☁️ Deployment (Cloudflare Workers)

This project targets **Cloudflare Workers** directly, leveraging Nitro presets.

### 1. Build Pipelines
```bash
# Compile Cloudflare Worker production distribution
pnpm build:worker

# Local dry-run preview using Wrangler
pnpm preview:worker

# Production deploy (Wrangler pushes .output/server directory)
pnpm deploy
```

### 2. Environment Variables Configuration
For full features to build and deploy, set these environment variables in your Cloudflare Worker dash or local Wrangler setup:

| Variable | Description |
| :--- | :--- |
| `CLOUDFLARE_KV_NAMESPACE_ID` | The production Workers KV namespace binding. |
| `RAIDER_IO_KEY` | Optional Raider.io developer key. |
| `TWITCH_CLIENT_ID` | Twitch Developer console app ID. |
| `TWITCH_CLIENT_SECRET` | Twitch Developer console app secret. |
| `DISCORD_WEBHOOK_URL` | Discord webhook URL target for recruitment. |
| `CLOUDFLARE_ENV` | Set to `preview` in staging environments to silence scheduled crons. |

### 3. Cron Schedules
Nitro maps production tasks inside `nuxt.config.ts`. In production builds, the roster refresh task runs every **10 minutes**:
```
*/10 * * * *
```
*(Setting `CLOUDFLARE_ENV=preview` silences cron triggers while preserving KV bindings).*

Worker Logs, invocation logs, and source-map uploads are enabled in the generated Wrangler configuration. Roster cron events emit `roster.refresh.started`, `roster.refresh.succeeded`, `roster.refresh.failed`, and `roster.snapshot.degraded` structured messages.

Test the scheduled handler locally after a Worker build:

```bash
pnpm build:worker
pnpm exec wrangler --cwd .output dev --test-scheduled
curl "http://localhost:8787/cdn-cgi/handler/scheduled?cron=*/10+*+*+*+*&format=json"
```

---

## 📄 License
MIT
