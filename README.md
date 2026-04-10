# EIF Website

A World of Warcraft guild website for **Exercise in Futility** on US-Illidan.

Built with [Nuxt 4](https://nuxt.com), [Nuxt UI v4](https://ui.nuxt.com), and deployed on [Cloudflare Workers](https://workers.cloudflare.com/).

## Features

- 🏰 **Guild Roster** - Raider.IO snapshots cached in NuxtHub KV and served instantly
- 📰 **News & Updates** - Markdown-powered blog via Nuxt Content
- 🎮 **Streams** - Guild member streaming status (coming soon)
- 📝 **Guild Applications** - Join request form (coming soon)

## Tech Stack

- **Framework**: Nuxt 4
- **Hosting**: Cloudflare Workers
- **UI**: Nuxt UI v4 + Tailwind CSS
- **Storage**: NuxtHub KV
- **CMS**: Prismic
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

### 3. Build configuration

- Production builds can use `pnpm build` on Cloudflare, where Nuxt/Nitro will detect the Workers target automatically.
- For local manual Workers builds, use `NITRO_PRESET=cloudflare_module pnpm build`.
- To build preview bindings locally, also set `CLOUDFLARE_ENV=preview`.

### 4. Cron trigger

The Worker cron is generated at build time from [nuxt.config.ts](/Users/jesse/Developer/eif-website/nuxt.config.ts) and runs every 10 minutes in production:

```txt
*/10 * * * *
```

Preview builds should set `CLOUDFLARE_ENV=preview`, which disables the cron trigger in the generated Worker config while still keeping the preview KV binding.

### 5. Local development

- `pnpm dev` uses NuxtHub local storage under `.data/` for KV.
- Remote Cloudflare bindings are optional for development and are not required for the roster page to work locally.

## Project Structure

```
app/
├── components/
│   ├── app/        # Global components (Header, Footer, Logo, JoinModal)
│   └── home/       # Homepage sections
├── composables/    # Shared state (useJoinModal)
├── pages/          # Route pages
└── assets/css/     # Global styles
content/
└── News/           # Markdown blog posts
public/             # Static assets
server/             # Server routes, tasks, and utilities
```

## External APIs

- **Raider.io** - Guild roster and Mythic+ data
- **Twitch** - Streaming status (planned)

## License

MIT
