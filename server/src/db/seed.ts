import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { getDB } from './database.js'

const PROJECT_ROOT = process.cwd()
const PAGES_DIR = join(PROJECT_ROOT, 'content', 'pages')

interface PageDefinition {
  meta: { id: string; route: string; title: string }
  schema: Record<string, unknown>
  layout: Record<string, unknown>
  data: Record<string, unknown>
}

function loadPageDefinitions(): PageDefinition[] {
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

  return pages
}

export function seedDatabase(force = false) {
  const db = getDB()

  // Check if already seeded
  const seeded = db.query('SELECT value FROM seed_metadata WHERE key = ?').get('seeded') as { value: string } | null

  if (seeded && !force) {
    console.log('Database already seeded. Use force=true to re-seed.')
    return
  }

  const pages = loadPageDefinitions()

  const insertPage = db.prepare(`
    INSERT OR REPLACE INTO pages (id, route, title, definition, version, updated_at)
    VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
  `)

  const transaction = db.transaction(() => {
    for (const page of pages) {
      insertPage.run(page.meta.id, page.meta.route, page.meta.title, JSON.stringify(page))
    }

    // Mark as seeded
    db.prepare('INSERT OR REPLACE INTO seed_metadata (key, value) VALUES (?, ?)').run('seeded', new Date().toISOString())
  })

  transaction()

  console.log(`Seeded ${pages.length} pages into database`)
}
