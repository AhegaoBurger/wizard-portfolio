import { readFileSync, readdirSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..', '..', '..')
const PAGES_DIR = join(PROJECT_ROOT, 'content', 'pages')

interface PageDefinition {
  meta: { id: string; route: string; title: string }
  schema: Record<string, unknown>
  layout: Record<string, unknown>
  data: Record<string, unknown>
}

interface PageSummary {
  id: string
  route: string
  title: string
  version: number
  updated_at: string
}

// Simple in-memory cache
let cachedPages: PageDefinition[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = process.env.NODE_ENV === 'production' ? 60000 : 0

function loadPages(): PageDefinition[] {
  const now = Date.now()
  if (cachedPages && now - cacheTimestamp < CACHE_TTL) {
    return cachedPages
  }

  const pages: PageDefinition[] = []

  try {
    const files = readdirSync(PAGES_DIR).filter(f => f.endsWith('.json'))

    for (const file of files) {
      try {
        const content = readFileSync(join(PAGES_DIR, file), 'utf-8')
        const page = JSON.parse(content) as PageDefinition

        if (!page.meta?.id || !page.meta?.route || !page.meta?.title) {
          console.warn(`Skipping ${file}: missing required meta fields`)
          continue
        }

        pages.push(page)
      } catch (e) {
        console.error(`Failed to read page definition ${file}:`, e)
      }
    }
  } catch (e) {
    console.error('Failed to read pages directory:', e)
  }

  cachedPages = pages
  cacheTimestamp = now
  return pages
}

export function listPages(): PageSummary[] {
  const pages = loadPages()
  return pages
    .map(p => ({
      id: p.meta.id,
      route: p.meta.route,
      title: p.meta.title,
      version: 1,
      updated_at: new Date().toISOString(),
    }))
    .sort((a, b) => a.route.localeCompare(b.route))
}

export function getPageById(id: string): PageDefinition | null {
  const pages = loadPages()
  return pages.find(p => p.meta.id === id) ?? null
}

export function getPageByRoute(route: string): PageDefinition | null {
  const pages = loadPages()
  return pages.find(p => p.meta.route === route) ?? null
}
