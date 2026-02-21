# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern portfolio website with a retro Macintosh/wizard theme, built as a **Bun workspace monorepo** with a clean separation between frontend and backend. The application features a pixel-art aesthetic with a black background, white borders, CRT scanline effects, and custom ChicagoFLF font to emulate classic Mac OS.

**Architecture:**
- **Client**: Vite + React 19 + TanStack Router (file-based) + TanStack Query
- **Server**: Hono backend on Bun runtime with bun:sqlite
- **Shared**: TypeScript types shared between client/server
- **Content**: JSON files for content + PageDefinition JSON files for the rendering engine

## Development Commands

```bash
# Install dependencies (uses Bun workspace)
bun install

# Development (runs both client and server concurrently)
bun dev                 # Client on http://localhost:5173, Server on http://localhost:3000

# Individual dev servers
bun dev:client          # Vite dev server on port 5173
bun dev:server          # Hono dev server with --hot on port 3000

# Production build
bun run build           # Builds both client and server
bun run build:client    # Builds client to dist/client/
bun run build:server    # Builds server to server/dist/

# Production server (via PM2 with Bun interpreter)
pm2 start ecosystem.config.js
pm2 logs wizard-portfolio
pm2 restart wizard-portfolio

# Linting
bun lint                # Runs ESLint on client code
```

## Architecture

### Workspace Structure (Bun monorepo)

```
wizard-portfolio/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── features/           # Feature-based modules
│   │   │   ├── home/           # Home page feature
│   │   │   │   ├── components/ # wizard-profile, contact-window, projects-window, skills-window
│   │   │   │   ├── pages/      # HomePage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── grimoire/       # Projects showcase feature
│   │   │   │   ├── api/        # grimoire.hooks.ts, grimoire.queries.ts
│   │   │   │   ├── pages/      # GrimoirePage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── spells/         # Spells feature
│   │   │   │   ├── api/        # spells.hooks.ts, spells.queries.ts
│   │   │   │   ├── components/ # draggable-spell.tsx
│   │   │   │   ├── pages/      # SpellsPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── potions/        # Potions/tools feature
│   │   │   │   ├── api/        # potions.hooks.ts, potions.queries.ts
│   │   │   │   ├── pages/      # PotionsPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── trash/          # Trash feature
│   │   │   │   ├── api/        # trash.hooks.ts, trash.queries.ts
│   │   │   │   ├── pages/      # TrashPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── editor/         # In-browser page editor (admin)
│   │   │   │   ├── api/        # editor.queries.ts, editor.service.ts
│   │   │   │   ├── components/ # json-editor, live-preview, editor-toolbar, page-selector
│   │   │   │   ├── pages/      # EditorPage.tsx
│   │   │   │   └── index.ts
│   │   │   └── renderer/       # JSON-driven rendering engine
│   │   │       ├── engine/     # PageRenderer, NodeRenderer, DataProvider, BehaviorWrapper
│   │   │       ├── components/ # content-components, layout-components, interactive-components, list-repeater
│   │   │       ├── registry/   # component-registry, register-defaults, behavior-presets
│   │   │       ├── schemas/    # Zod schemas for PageDefinition, LayoutNode, SchemaField, Behavior
│   │   │       ├── types/      # TypeScript types (PageDefinition, LayoutNode, etc.)
│   │   │       └── index.ts
│   │   ├── shared/             # Shared client code
│   │   │   ├── components/
│   │   │   │   ├── interactive/  # dialog-box, lightning, particle-effect, custom-cursor, starfield
│   │   │   │   ├── layout/      # desktop-layout, mobile-layout, window, mobile-window, page-shell, loading-screen
│   │   │   │   ├── navigation/  # back-button, clock, folder-icon, mana-bar, tab-bar
│   │   │   │   └── ui/          # shadcn/ui components (50+ Radix UI primitives)
│   │   │   ├── hooks/          # use-mobile, use-toast, use-custom-cursor
│   │   │   ├── lib/            # api-client.ts (fetchAPI helper)
│   │   │   └── utils/          # cn.ts (className merging)
│   │   ├── routes/             # TanStack Router file-based routes
│   │   │   ├── __root.tsx      # Root layout (QueryClientProvider, CRT overlay, custom cursor)
│   │   │   ├── index.tsx       # / → HomePage
│   │   │   ├── grimoire/index.tsx  # /grimoire → GrimoirePage
│   │   │   ├── spells.tsx      # /spells → SpellsPage
│   │   │   ├── potions.tsx     # /potions → PotionsPage
│   │   │   ├── trash.tsx       # /trash → TrashPage
│   │   │   └── admin/editor/   # /admin/editor → EditorPage
│   │   ├── styles/             # Global CSS (pixel patterns, CRT effects, phosphor glow)
│   │   ├── main.tsx            # Vite entry point (RouterProvider)
│   │   └── routeTree.gen.ts    # Auto-generated route tree (TanStack Router)
│   ├── public/                 # Static assets
│   ├── index.html              # HTML template
│   ├── vite.config.ts          # Vite + TanStack Router plugin config
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   └── package.json            # Client dependencies
│
├── server/                     # Hono backend (Bun runtime)
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.ts     # SQLite via bun:sqlite (WAL mode, schema init)
│   │   │   └── seed.ts         # Seeds DB from content/pages/*.json files
│   │   ├── middleware/
│   │   │   └── auth.ts         # Bearer token auth for admin routes (EDITOR_TOKEN env var)
│   │   ├── routes/
│   │   │   ├── content.ts      # GET /api/content/* (profile, projects, skills, spells, tools, trash)
│   │   │   ├── pages.ts        # GET /api/pages/* (list, by ID, by route - reads from SQLite)
│   │   │   └── admin.ts        # PUT/POST/DELETE /api/admin/pages/* (CRUD, auth-protected)
│   │   ├── services/
│   │   │   └── content.service.ts  # JSON file reading from content/ with caching
│   │   └── index.ts            # Hono server entry point
│   ├── dist/                   # Compiled server output
│   └── package.json            # Server dependencies (@types/bun, hono)
│
├── shared/                     # Shared TypeScript types
│   └── types/
│       ├── index.ts            # Type exports
│       ├── profile.ts, project.ts, skill.ts, spell.ts, tool.ts, trash.ts
│
├── content/                    # Content data
│   ├── profile.json            # Personal profile data
│   ├── projects.json           # Projects showcase
│   ├── skills.json             # Skills/abilities
│   ├── spells.json             # Spells page content
│   ├── tools.json              # Tools/potions
│   ├── trash.json              # Deleted items
│   └── pages/                  # PageDefinition JSON files (for rendering engine)
│       ├── home.json           # Home page definition
│       ├── grimoire.json       # Grimoire page definition
│       ├── spells.json         # Spells page definition
│       ├── potions.json        # Potions page definition
│       └── trash.json          # Trash page definition
│
├── data/                       # SQLite database (auto-created, gitignored)
│   └── wizard.db
├── bunfig.toml                 # Bun workspace configuration
├── ecosystem.config.js         # PM2 config (interpreter: 'bun')
└── package.json                # Root workspace scripts
```

### Client (React + Vite)

**Framework**: React 19 with Vite 5 for fast development and optimized production builds

**Routing**: TanStack Router with file-based routing
- `/` - HomePage (desktop/mobile layouts with wizard profile)
- `/grimoire` - Projects showcase with particle effects
- `/spells` - Draggable spells with explosion animations
- `/potions` - Tools/potions display
- `/trash` - Deleted items management
- `/admin/editor` - In-browser page editor (protected by token)

Route files live in `client/src/routes/` and the route tree is auto-generated to `routeTree.gen.ts` by the TanStack Router Vite plugin.

**Feature-Based Organization**: Code is organized by feature under `client/src/features/`:
- Each feature has its own `api/`, `components/`, `pages/`, and `index.ts`
- **api/** contains TanStack Query hooks and query key factories (e.g., `grimoire.hooks.ts`, `grimoire.queries.ts`)
- **renderer/** is the JSON-driven rendering engine (see Rendering Engine section)
- **editor/** is the admin page editor with Monaco and live preview

**Data Fetching**: TanStack Query with query key factories per feature:
- Query options are defined in `<feature>/api/<feature>.queries.ts` using `queryOptions()`
- Custom hooks wrap queries in `<feature>/api/<feature>.hooks.ts`
- QueryClient is configured in `routes/__root.tsx` with 5-minute stale time

**API Client**: `shared/lib/api-client.ts` exports `fetchAPI<T>()` that uses the Vite proxy (`/api` → backend)

### Server (Hono on Bun)

**Runtime**: Bun with native `bun:sqlite` for database access

**API Route Groups**:
- `GET /api/content/*` - Static content from JSON files (profile, projects, skills, spells, tools, trash)
- `GET /api/pages/*` - Page definitions from SQLite (list, by ID, by route)
- `PUT/POST/DELETE /api/admin/pages/*` - Page CRUD (protected by `EDITOR_TOKEN` Bearer auth)
- `GET /api/health` - Health check endpoint
- `POST /api/admin/seed` - Force re-seed database from JSON files

**Database**: SQLite via `bun:sqlite`
- Stored at `data/wizard.db` (auto-created)
- WAL mode enabled for performance
- `pages` table stores PageDefinition JSON blobs
- `seed_metadata` table tracks seed state
- Auto-seeds on startup from `content/pages/*.json` files

**Static File Serving**: In production, serves the built client from `dist/client/` with SPA fallback

**CORS**: Configured via `CLIENT_URL` env var (defaults to `http://localhost:5173`)

### Rendering Engine (`features/renderer/`)

A JSON-driven rendering system that converts PageDefinition JSON into React components:

- **PageDefinition**: `{ meta, schema, layout, data }` - a complete page described in JSON
- **PageRenderer**: Top-level component that takes a PageDefinition and renders it
- **NodeRenderer**: Recursively renders LayoutNode trees, resolving data bindings
- **DataProvider/useDataContext**: React context for data binding (dot-path resolution like `profile.name`)
- **BehaviorWrapper**: Applies animation behaviors (Framer Motion presets) to nodes
- **Component Registry**: Maps `type` strings to React components (window, grid, text, list, etc.)
- **Behavior Presets**: Named animation configs (fade-in, slide-up, scale-in, stagger)

### Shared Types

TypeScript types in `shared/types/` are used by both client and server to ensure type safety across the full stack.

### Key Technologies

- **Bun** - JavaScript runtime and package manager (workspace monorepo)
- **React 19** - Latest React with concurrent features
- **Vite 5** - Next-generation frontend tooling
- **TanStack Router** - Type-safe file-based routing with auto-generated route tree
- **TanStack Query** - Server state management with query key factories
- **Hono** - Ultra-fast web framework running on Bun
- **bun:sqlite** - Native SQLite database (WAL mode)
- **TypeScript** - Strict mode enabled across all packages
- **Tailwind CSS** - Utility-first CSS with custom pixel-art patterns and ChicagoFLF font
- **Framer Motion** - Production-ready motion library for React
- **Monaco Editor** - VS Code editor component (used in admin editor)
- **shadcn/ui** - High-quality UI components built on Radix UI
- **Zod** - TypeScript-first schema validation (used for PageDefinition schemas)

### Styling System

The app uses a custom pixel-art design system:

- **Font**: ChicagoFLF (retro Mac OS font) applied via `font-pixel` class
- **Color scheme**: Black background (`#000000`) with white foreground (`#ffffff`)
- **Patterns**: Three custom SVG patterns defined in `client/src/styles/globals.css`:
  - `bg-pattern-diagonal` - Diagonal stripes
  - `bg-pattern-checker` - Checkerboard pattern (used for progress bars)
  - `bg-pattern-dots` - Dotted pattern
- **CRT Effects**: Scanline overlay, phosphor glow, ambient particles (defined in globals.css)
- **Components**: All UI uses white borders with black backgrounds for authentic retro look

### Responsive Design

The app has two distinct layouts:

1. **Desktop**: Traditional windowed interface with draggable windows, custom cursor, mana bar, and clock
2. **Mobile**: Tab-based interface using `MobileLayout` component with simplified navigation

Layout switching is handled by the `useMobile()` hook in `shared/hooks/use-mobile.tsx`.

### Animation Patterns

Framer Motion is used extensively:
- **Page transitions**: Fade in/out with `AnimatePresence`
- **Component entrances**: Scale and opacity animations with staggered delays
- **Interactive states**: `whileHover`, `whileTap` for buttons and clickable elements
- **Custom cursor**: Desktop-only pixel cursor rendered once in `__root.tsx` via `<CustomCursor>` (do not duplicate in pages)
- **Particle effects**: Custom particle system for visual effects
- **Draggable spells**: Drag-and-drop with explosion animations
- **Behavior presets**: Reusable animation configs in the rendering engine

### Path Aliases

TypeScript paths configured in `client/vite.config.ts`:
- `@/*` → `client/src/*` (features, shared, routes, styles, etc.)
- `@shared/*` → `shared/*` (shared types package)

## Important Notes

### Vite Configuration

Client vite config (`client/vite.config.ts`) includes:
- **TanStack Router plugin** for file-based route generation
- **React plugin** with Fast Refresh
- **Path aliases** (`@/` and `@shared/`)
- **Dev server** proxy: `/api` → `http://localhost:3000`
- **Build optimization** with vendor code splitting (React, TanStack Router, Framer Motion)

### Component Patterns

When creating new components:
- `"use client"` directive is **NOT needed** (this is not Next.js!)
- Components are regular React function components
- Follow the pixel-art aesthetic: white borders, black backgrounds, pixel fonts
- Check if mobile/desktop layout differences are needed using `useMobile()`
- Wrap text/buttons with Framer Motion for entrance animations
- Use the `cn()` utility from `@/shared/utils/cn` for conditional classNames
- Place feature-specific components in `features/<feature>/components/`
- Place shared components in `shared/components/`

### Shared Page Components

These shared components eliminate boilerplate across page files. Use them when building new pages:

- **`<PageShell>`** (`shared/components/layout/page-shell.tsx`): Wraps desktop page content with the standard outer div (`min-h-screen bg-black p-4 font-pixel overflow-hidden relative`), `AnimatePresence`, fade-in/out `motion.div`, and an animated `BackButton` fixed at bottom-right. Accepts `showBackButton` (default `true`) and `backButtonDelay` (default `0.4`) props. Uses `useNavigate()` internally to navigate back to `/`.
- **`<LoadingScreen>`** (`shared/components/layout/loading-screen.tsx`): Full-screen loading spinner with `glow-text animate-flicker`. Accepts optional `message` prop (default `"Loading..."`). Use this for data-fetching loading states instead of inline loading markup.
- **`<CustomCursor>`** (`shared/components/interactive/custom-cursor.tsx`): The pixel cursor (white 4x4 square that fills on click). Rendered **once** in `__root.tsx` via `<DesktopCursor />` — it is automatically hidden on mobile. **Do not** add cursor logic to individual pages.
- **`useCustomCursor()`** (`shared/hooks/use-custom-cursor.ts`): Hook that tracks mouse position and click state. Used internally by `<CustomCursor>`, not needed in page components.

**Typical desktop page structure:**
```tsx
if (loading) return <LoadingScreen />;
if (isMobile) return <MobileLayout windows={...} />;
return (
  <PageShell>
    <motion.div initial={...} animate={...}>
      <Window title="..." ...>{/* content */}</Window>
    </motion.div>
  </PageShell>
);
```

### Styling Guidelines

- Always use `border-white` for borders
- Use `font-pixel` class for ChicagoFLF font
- Use the three pattern classes for backgrounds: `bg-pattern-checker`, `bg-pattern-diagonal`, `bg-pattern-dots`
- CRT overlay and ambient particles are applied globally via `__root.tsx`
- Maintain the retro aesthetic: avoid modern shadows, gradients, or rounded corners

### Content Management

**Static content** (served via `/api/content/*`): Edit JSON files in `content/`:
- `profile.json` - Your personal info, bio, links
- `projects.json` - Projects showcase items
- `skills.json` - Skills and abilities
- `spells.json` - Spells page content
- `tools.json` - Tools/potions items
- `trash.json` - Deleted/archived items

**Page definitions** (served via `/api/pages/*`): Edit JSON files in `content/pages/`:
- These are PageDefinition files with `{ meta, schema, layout, data }` structure
- Seeded into SQLite on first server startup
- Can be edited via the in-browser editor at `/admin/editor`
- Force re-seed with `POST /api/admin/seed?force=true`

### Adding a New Feature

1. Create directory under `client/src/features/<feature-name>/`
2. Add `api/` with query key factory and hooks (using TanStack Query)
3. Add `components/` for feature-specific components
4. Add `pages/` for page components — use `<LoadingScreen>` for loading state, `<PageShell>` for the desktop shell wrapper
5. Add `index.ts` barrel export
6. Create a route file in `client/src/routes/` (TanStack Router auto-generates the route tree)

### Adding New API Endpoints

1. Add a new JSON file to `content/` (or `content/pages/` for page definitions)
2. Create a TypeScript type in `shared/types/`
3. Add the route handler to `server/src/routes/`
4. Add the service method to `server/src/services/content.service.ts` (if serving static JSON)

### Production Deployment

**Build process:**
```bash
bun run build
# Builds client to dist/client/
# Builds server to server/dist/
```

**PM2 deployment** (uses Bun as interpreter):
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Enable auto-start on server boot
```

**Environment variables:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to `production` for static file serving
- `CLIENT_URL` - CORS origin (default: `http://localhost:5173`)
- `EDITOR_TOKEN` - Bearer token for admin API access

The Hono server:
- Serves API endpoints at `/api/*`
- Serves static client files from `dist/client/`
- Handles client-side routing (falls back to index.html for SPA)
- Seeds SQLite database on startup from `content/pages/` JSON files
- Runs on port 3000 in production via Bun

### Development Workflow

1. **Start dev servers**: `bun dev` (or run client/server separately)
2. **Client hot reload**: Vite HMR on port 5173
3. **Server hot reload**: Bun `--hot` on port 3000
4. **Edit content**: Modify JSON files in `content/`
5. **Add features**: Create feature modules in `client/src/features/`
6. **Add routes**: Create route files in `client/src/routes/` (auto-generated route tree)
7. **Build**: `bun run build` to create production build
8. **Deploy**: Use PM2 to run the production server

### Common Tasks

**Add a new page:**
1. Create a feature module in `client/src/features/<name>/`
2. Create a route file in `client/src/routes/<name>.tsx`
3. Use `<LoadingScreen />` for loading state, `<PageShell>` for the desktop wrapper (do **not** add custom cursor or BackButton logic — these are handled globally)
4. Add navigation link if needed

**Add a new UI component:**
1. Use shadcn CLI: `cd client && npx shadcn@latest add <component-name>`
2. Component will be added to `client/src/shared/components/ui/`

**Modify styling:**
1. Global styles: `client/src/styles/globals.css`
2. Tailwind config: `client/tailwind.config.ts`
3. Component styles: Use Tailwind utility classes

**Debug API issues:**
1. Check server logs: `bun dev:server` or `pm2 logs wizard-portfolio`
2. Verify JSON files in `content/` directory
3. Check network tab in browser DevTools
4. Verify CORS configuration in `server/src/index.ts`
