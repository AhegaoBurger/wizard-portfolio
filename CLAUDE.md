# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern portfolio website with a retro Macintosh/wizard theme, built as a **pnpm monorepo** with a clean separation between frontend and backend. The application features a pixel-art aesthetic with a black background, white borders, and custom ChicagoFLF font to emulate classic Mac OS.

**Architecture:**
- **Client**: Vite + React 19 + React Router SPA
- **Server**: Hono backend API serving JSON content
- **Shared**: TypeScript types shared between client/server
- **Content**: JSON files for easy content editing

## Development Commands

```bash
# Install dependencies (uses pnpm workspace)
pnpm install

# Development (runs both client and server concurrently)
pnpm dev                # Client on http://localhost:5173, Server on http://localhost:3000

# Individual dev servers
pnpm dev:client         # Vite dev server on port 5173
pnpm dev:server         # Hono dev server on port 3000

# Production build
pnpm build              # Builds both client and server
pnpm build:client       # Builds client to dist/client/
pnpm build:server       # Builds server to server/dist/

# Production server (via PM2)
pm2 start ecosystem.config.js
pm2 logs wizard-portfolio
pm2 restart wizard-portfolio

# Linting
pnpm lint               # Runs ESLint on client code
```

## Architecture

### Workspace Structure (pnpm monorepo)

```
/root/projects/wizard-portfolio/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/         # React components organized by type
│   │   │   ├── content/        # Content components (wizard-profile, projects, skills, contact)
│   │   │   ├── interactive/    # Interactive components (particles, draggable, dialogs)
│   │   │   ├── layout/         # Layout components (desktop, mobile, windows)
│   │   │   ├── navigation/     # Navigation components (header, footer, back-button, clock, mana-bar)
│   │   │   └── ui/             # shadcn/ui components (50+ components)
│   │   ├── hooks/              # Custom React hooks (useContent, useMobile, useToast)
│   │   ├── lib/                # Utilities (cn() helper for className merging)
│   │   ├── pages/              # Page components for routing
│   │   ├── services/           # API service layer
│   │   ├── styles/             # Global CSS with pixel patterns
│   │   ├── App.tsx             # App wrapper
│   │   ├── main.tsx            # Vite entry point
│   │   └── router.tsx          # React Router configuration
│   ├── public/                 # Static assets
│   ├── index.html              # HTML template
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Client dependencies
│
├── server/                     # Hono backend
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   │   └── content.ts      # Content API endpoints
│   │   ├── services/           # Business logic layer
│   │   │   └── content.service.ts  # Content service with caching
│   │   └── index.ts            # Hono server entry point
│   ├── dist/                   # Compiled server output
│   ├── tsconfig.json           # Server TypeScript config
│   └── package.json            # Server dependencies
│
├── shared/                     # Shared TypeScript types
│   └── types/
│       ├── index.ts            # Type exports
│       ├── profile.ts          # Profile type
│       ├── project.ts          # Project type
│       ├── skill.ts            # Skill type
│       ├── spell.ts            # Spell type
│       ├── tool.ts             # Tool type
│       └── trash.ts            # Trash item type
│
├── content/                    # JSON data files (edit these for content changes!)
│   ├── profile.json            # Personal profile data
│   ├── projects.json           # Projects showcase
│   ├── skills.json             # Skills/abilities
│   ├── spells.json             # Spells page content
│   ├── tools.json              # Tools/potions
│   └── trash.json              # Deleted items
│
├── dist/client/                # Production client build (served by Hono in production)
├── ecosystem.config.js         # PM2 configuration for production deployment
├── package.json                # Root workspace scripts
└── pnpm-workspace.yaml         # pnpm workspace configuration
```

### Client (React + Vite)

**Framework**: React 19 with Vite 5 for fast development and optimized production builds

**Routing**: React Router v6 for client-side routing
- `/` - HomePage (desktop/mobile layouts with wizard profile)
- `/grimoire` - Projects showcase with particle effects
- `/spells` - Draggable spells with explosion animations
- `/potions` - Tools/potions display
- `/trash` - Deleted items management

**Component Organization**:
- **content/** - Content display components (wizard-profile, projects, skills, contact, tab-bar)
- **interactive/** - Interactive components (particle-effect, draggable-spell, dialog-box, lightning)
- **layout/** - Layout components (desktop-layout, mobile-layout, window, mobile-window)
- **navigation/** - Navigation components (header, footer, back-button, clock, mana-bar)
- **ui/** - shadcn/ui components (50+ Radix UI primitives with custom styling)

**Data Fetching**: Custom hooks in `hooks/useContent.ts` that fetch from the Hono API:
- `useProfile()` - Fetches profile data
- `useProjects()` - Fetches projects data
- `useSkills()` - Fetches skills data
- `useSpells()` - Fetches spells data
- `useTools()` - Fetches tools data
- `useTrash()` - Fetches trash items

**API Service**: `services/api.ts` provides the base API client for backend communication

### Server (Hono)

**Framework**: Hono - Ultra-fast web framework for edge computing

**API Endpoints** (`/api/*`):
- `GET /api/profile` - Returns profile.json
- `GET /api/projects` - Returns projects.json
- `GET /api/skills` - Returns skills.json
- `GET /api/spells` - Returns spells.json
- `GET /api/tools` - Returns tools.json
- `GET /api/trash` - Returns trash.json

**Static File Serving**: In production, serves the built client from `dist/client/`

**Service Layer**: `content.service.ts` implements:
- JSON file reading from `content/` directory
- In-memory caching for performance
- Type-safe responses using shared types
- Database-ready architecture (currently reads from JSON files)

**CORS**: Configured to allow requests from `http://localhost:5173` in development

### Shared Types

TypeScript types in `shared/types/` are used by both client and server to ensure type safety across the full stack.

### Key Technologies

- **React 19** - Latest React with concurrent features
- **Vite 5** - Next-generation frontend tooling
- **React Router v6** - Client-side routing
- **Hono** - Ultra-fast edge-compatible web framework
- **TypeScript** - Strict mode enabled across all packages
- **Tailwind CSS** - Utility-first CSS with custom pixel-art patterns and ChicagoFLF font
- **Framer Motion** - Production-ready motion library for React
- **shadcn/ui** - High-quality UI components built on Radix UI
- **Zod** - TypeScript-first schema validation
- **pnpm** - Fast, disk space efficient package manager with workspace support

### Styling System

The app uses a custom pixel-art design system:

- **Font**: ChicagoFLF (retro Mac OS font) applied via `font-pixel` class
- **Color scheme**: Black background (`#000000`) with white foreground (`#ffffff`)
- **Patterns**: Three custom SVG patterns defined in `client/src/styles/globals.css`:
  - `bg-pattern-diagonal` - Diagonal stripes
  - `bg-pattern-checker` - Checkerboard pattern (used for progress bars)
  - `bg-pattern-dots` - Dotted pattern
- **Components**: All UI uses white borders with black backgrounds for authentic retro look

### Responsive Design

The app has two distinct layouts:

1. **Desktop**: Traditional windowed interface with draggable windows, custom cursor, mana bar, and clock
2. **Mobile**: Tab-based interface using `MobileLayout` component with simplified navigation

Layout switching is handled by the `useMobile()` hook which detects screen width.

### Animation Patterns

Framer Motion is used extensively:
- **Page transitions**: Fade in/out with `AnimatePresence`
- **Component entrances**: Scale and opacity animations with staggered delays
- **Interactive states**: `whileHover`, `whileTap` for buttons and clickable elements
- **Custom cursor**: Desktop-only custom pixel cursor that follows mouse position
- **Particle effects**: Custom particle system for visual effects
- **Draggable spells**: Drag-and-drop with explosion animations

### Path Aliases

TypeScript paths are configured in `client/tsconfig.json` with `@/*` alias:
- `@/components` → `/client/src/components`
- `@/lib` → `/client/src/lib`
- `@/hooks` → `/client/src/hooks`
- `@/pages` → `/client/src/pages`
- `@/services` → `/client/src/services`

## Important Notes

### Vite Configuration

Client vite config (`client/vite.config.ts`) includes:
- **React plugin** with Fast Refresh
- **Path aliases** for clean imports
- **Dev server** proxy to backend API (optional, currently uses direct fetch)
- **Build optimization** with vendor code splitting (React, Framer Motion)

### Component Patterns

When creating new components:
- Use `"use client"` directive is **NOT needed** (this is not Next.js!)
- Components are regular React function components
- Follow the pixel-art aesthetic: white borders, black backgrounds, pixel fonts
- Check if mobile/desktop layout differences are needed using `useMobile()`
- Wrap text/buttons with Framer Motion for entrance animations
- Use the `cn()` utility from `@/lib/utils` for conditional classNames

### Styling Guidelines

- Always use `border-white` for borders
- Use `font-pixel` class for ChicagoFLF font
- Use the three pattern classes for backgrounds: `bg-pattern-checker`, `bg-pattern-diagonal`, `bg-pattern-dots`
- Maintain the retro aesthetic: avoid modern shadows, gradients, or rounded corners

### Content Management

**To edit content**: Simply modify the JSON files in `content/` directory:
- `profile.json` - Your personal info, bio, links
- `projects.json` - Projects showcase items
- `skills.json` - Skills and abilities
- `spells.json` - Spells page content
- `tools.json` - Tools/potions items
- `trash.json` - Deleted/archived items

The server will automatically serve the updated content. In production with caching, you may need to restart the server.

### Adding New API Endpoints

1. Add a new JSON file to `content/`
2. Create a TypeScript type in `shared/types/`
3. Add the endpoint to `server/src/routes/content.ts`
4. Add the service method to `server/src/services/content.service.ts`
5. Create a custom hook in `client/src/hooks/useContent.ts`

### Production Deployment

**Build process:**
```bash
pnpm build
# Builds client to dist/client/
# Builds server to server/dist/
```

**PM2 deployment:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Enable auto-start on server boot
```

The Hono server:
- Serves API endpoints at `/api/*`
- Serves static client files from `dist/client/`
- Handles client-side routing (falls back to index.html for SPA)
- Runs on port 3000 in production

### Development Workflow

1. **Start dev servers**: `pnpm dev` (or run client/server separately)
2. **Client hot reload**: Vite HMR on port 5173
3. **Server hot reload**: tsx watch on port 3000
4. **Edit content**: Modify JSON files in `content/`
5. **Add features**: Add components in `client/src/components/`
6. **Build**: `pnpm build` to create production build
7. **Deploy**: Use PM2 to run the production server

### Common Tasks

**Add a new page:**
1. Create component in `client/src/pages/`
2. Add route to `client/src/router.tsx`
3. Add navigation link if needed

**Add a new UI component:**
1. Use shadcn CLI: `cd client && npx shadcn@latest add <component-name>`
2. Component will be added to `client/src/components/ui/`

**Modify styling:**
1. Global styles: `client/src/styles/globals.css`
2. Tailwind config: `client/tailwind.config.ts`
3. Component styles: Use Tailwind utility classes

**Debug API issues:**
1. Check server logs: `pnpm dev:server` or `pm2 logs wizard-portfolio`
2. Verify JSON files in `content/` directory
3. Check network tab in browser DevTools
4. Verify CORS configuration in `server/src/index.ts`
