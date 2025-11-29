# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio website with a retro Macintosh/wizard theme. The application features a pixel-art aesthetic with a black background, white borders, and custom ChicagoFLF font to emulate classic Mac OS.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server
pnpm dev                # Runs on http://localhost:3000

# Production build
pnpm build

# Production server
pnpm start

# Linting
pnpm lint

# Production deployment (PM2)
pm2 start ecosystem.config.js
```

## Architecture

### App Structure (Next.js 15 App Router)

- **`app/`** - Next.js App Router pages
  - `page.tsx` - Main homepage with desktop/mobile layouts
  - `grimoire/` - Projects showcase page
  - `spells/` - Spells/abilities page
  - `potions/` - Potions/tools page
  - `trash/` - Trash bin page
  - `layout.tsx` - Root layout with metadata
  - `globals.css` - Global styles including custom font and pixel patterns

### Component Organization

- **`components/`** - Page-level components
  - Window system: `window.tsx`, `desktop-layout.tsx`, `mobile-layout.tsx`, `mobile-window.tsx`
  - UI elements: `clock.tsx`, `mana-bar.tsx`, `header.tsx`, `footer.tsx`, `back-button.tsx`
  - Content sections: `wizard-profile.tsx`, `projects.tsx`, `skills.tsx`, `contact.tsx`
  - Window wrappers: `projects-window.tsx`, `skills-window.tsx`, `contact-window.tsx`
  - Interactive: `draggable-spell.tsx`, `dialog-box.tsx`, `particle-effect.tsx`

- **`components/ui/`** - shadcn/ui components (dropdown, badge, chart, table, etc.)

- **`lib/`** - Utility functions
  - `utils.ts` - Contains `cn()` helper for className merging (clsx + tailwind-merge)

- **`hooks/`** - Custom React hooks
  - `use-mobile.tsx` - Mobile detection hook
  - `use-toast.ts` - Toast notifications

### Key Technologies

- **Next.js 15** with App Router and React Server Components
- **React 19** with client-side interactivity
- **TypeScript** with strict mode
- **Tailwind CSS** with custom pixel-art patterns and ChicagoFLF font
- **Framer Motion** for animations and transitions
- **shadcn/ui** components with Radix UI primitives
- **Zod** for form validation with React Hook Form

### Styling System

The app uses a custom pixel-art design system:

- **Font**: ChicagoFLF (retro Mac OS font) applied via `font-pixel` class
- **Color scheme**: Black background (`#000000`) with white foreground (`#ffffff`)
- **Patterns**: Three custom SVG patterns defined in globals.css:
  - `bg-pattern-diagonal` - Diagonal stripes
  - `bg-pattern-checker` - Checkerboard pattern (used for progress bars)
  - `bg-pattern-dots` - Dotted pattern
- **Components**: All UI uses white borders with black backgrounds for authentic retro look

### Responsive Design

The app has two distinct layouts:

1. **Desktop**: Traditional windowed interface with draggable windows, custom cursor, mana bar, and clock
2. **Mobile**: Tab-based interface using `MobileLayout` component with simplified navigation

Layout switching is handled by the `useIsMobile()` hook which detects screen width.

### Animation Patterns

Framer Motion is used extensively:
- **Page transitions**: Fade in/out with `AnimatePresence`
- **Component entrances**: Scale and opacity animations with staggered delays
- **Interactive states**: `whileHover`, `whileTap` for buttons and clickable elements
- **Custom cursor**: Desktop-only custom pixel cursor that follows mouse position

### Path Aliases

TypeScript paths are configured with `@/*` alias:
- `@/components` → `/components`
- `@/lib` → `/lib`
- `@/hooks` → `/hooks`
- `@/app` → `/app`

## Important Notes

### Next.js Configuration

- **Build errors ignored**: `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` are enabled in `next.config.mjs`
- **Images unoptimized**: `images.unoptimized` is set to true
- **Experimental features**: Uses webpack build workers and parallel compilation
- **Custom config merge**: Supports optional `v0-user-next.config` file for user overrides

### Component Patterns

When creating new components:
- Use `"use client"` directive for interactive components (most components in this app)
- Follow the pixel-art aesthetic: white borders, black backgrounds, pixel fonts
- Check if mobile/desktop layout differences are needed using `useIsMobile()`
- Wrap text/buttons with Framer Motion for entrance animations
- Use the `cn()` utility from `@/lib/utils` for conditional classNames

### Styling Guidelines

- Always use `border-white` for borders (set as default in globals.css)
- Use `font-pixel` class for ChicagoFLF font
- Use the three pattern classes for backgrounds: `bg-pattern-checker`, `bg-pattern-diagonal`, `bg-pattern-dots`
- Maintain the retro aesthetic: avoid modern shadows, gradients, or rounded corners

### Data Management

Currently all content (projects, skills, etc.) is hardcoded in component files. When editing content:
- Projects data is in `app/grimoire/page.tsx`
- Skills/abilities data is typically in component files
- No external API or CMS integration exists
