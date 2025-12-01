# EIF Website - AI Coding Agent Instructions

## Project Overview

A World of Warcraft guild website for "Exercise in Futility" (US-Illidan) built with **Nuxt 4** and **Nuxt UI v4**. Uses `pnpm` as the package manager.

## Architecture

### Directory Structure (Nuxt 4 App Directory)

- `app/` - Main application code (pages, components, composables)
- `content/` - Markdown content via `@nuxt/content` (news posts in `content/News/`)
- `public/` - Static assets (images, logos)
- `server/` - Server-side code (currently minimal)

### Key Modules

- **@nuxt/ui** (v4) - Component library with Tailwind CSS integration
- **@nuxt/content** (v3) - Content management for blog/news posts
- **motion-v** - Animation library
- **zod** - Schema validation

## Component Conventions

### UI Component Usage

Always use Nuxt UI components with the `U` prefix:

```vue
<UButton color="primary" variant="solid">Click me</UButton>
<UCard variant="soft">Content</UCard>
<UContainer>Centered content</UContainer>
```

### Component Organization

- `app/components/app/` - Global app-level components (Header, Footer, Logo, JoinModal)
- `app/components/home/` - Homepage-specific sections (HeroSection, FeatureSection, NewsSection)

### Composables Pattern

Shared state uses `useState` with string keys:

```typescript
// app/composables/useJoinModal.ts
export const useJoinModal = () => {
  const isOpen = useState("join-modal-open", () => false);
  return {
    isOpen,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
  };
};
```

## Styling Conventions

### Color Theme

Primary color is **pink** (configured in `app/app.config.ts`). Use semantic color names:

- `primary` (pink), `neutral` (zinc), `success`, `warning`, `error`, `info`, `secondary` (cyan)

### CSS Approach

- Custom shadow variants using hard pixel offsets (see `app/assets/css/main.css`)
- Fonts: "Geist" (sans), "Source Code Pro" (mono)
- Use Tailwind classes directly, prefer `dark:` prefixed classes for dark mode styles

### WoW Class Colors

For character display, use official WoW class colors (see `roster.vue` `getClassColor` function):

```typescript
'Death Knight': '#C41F3B', 'Paladin': '#F58CBA', 'Warlock': '#9482C9', // etc.
```

## Content Management

### Blog Posts Format

Create markdown files in `content/News/` with frontmatter:

```markdown
---
title: Post Title
description: Brief description
date: 2024-11-30
image:
  - image-name
tags:
  - Tag1
---
```

### Querying Content

```typescript
const { data: posts } = await useAsyncData("posts", () =>
  queryCollection("content").all()
);
```

## External API Integration

### Raider.io API

The roster page fetches guild data from Raider.io:

- Guild profile: `/api/v1/guilds/profile`
- Character data: `/api/v1/characters/profile`
- Always include proper query params: `region`, `realm`, `name`, `fields`
- **Planned**: Server route in `server/api/` for caching roster requests

### Twitch API (Planned)

The streams page will integrate with Twitch to display guild members who are currently streaming.

## Deployment

- **Platform**: Vercel
- **Build command**: `pnpm build`
- Supports Nuxt's server-side rendering and API routes

## Development Commands

```bash
pnpm dev      # Start dev server on localhost:3000
pnpm build    # Production build
pnpm preview  # Preview production build
```

## Planned Features

- **Guild Applications**: JoinModal form submissions will be stored in a database (D1, Neon, or Supabase under consideration)
- **Streams Page**: Twitch integration to list streaming guild members
- **Roster Caching**: Server-side caching for Raider.io API responses

## Important Notes

- Dark mode is the default preference (set in `nuxt.config.ts`)
- The app uses Nuxt 4 with compatibility date `2025-02-15`
- Guild-specific branding: pink primary color, fun/friendly tone in copy
- No testing framework currently configured
