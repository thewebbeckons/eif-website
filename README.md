# EIF Website

A World of Warcraft guild website for **Exercise in Futility** on US-Illidan.

Built with [Nuxt 4](https://nuxt.com), [Nuxt UI v4](https://ui.nuxt.com), and deployed on [Vercel](https://vercel.com).

## Features

- 🏰 **Guild Roster** - Live data from Raider.io with Mythic+ scores and raid progression
- 📰 **News & Updates** - Markdown-powered blog via Nuxt Content
- 🎮 **Streams** - Guild member streaming status (coming soon)
- 📝 **Guild Applications** - Join request form (coming soon)

## Tech Stack

- **Framework**: Nuxt 4
- **UI**: Nuxt UI v4 + Tailwind CSS
- **Content**: @nuxt/content for markdown blog posts
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
server/             # Server routes (planned)
```

## External APIs

- **Raider.io** - Guild roster and Mythic+ data
- **Twitch** - Streaming status (planned)

## License

MIT
