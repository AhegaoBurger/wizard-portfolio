import { Hono } from 'hono'
import { getDB } from '../db/database.js'

const pages = new Hono()

interface PageRow {
  id: string
  route: string
  title: string
  definition: string
  version: number
  created_at: string
  updated_at: string
}

// List all pages (summary)
pages.get('/', (c) => {
  try {
    const db = getDB()
    const rows = db.query('SELECT id, route, title, version, updated_at FROM pages ORDER BY route').all() as Omit<PageRow, 'definition' | 'created_at'>[]
    return c.json(rows)
  } catch (error) {
    return c.json({ error: 'Failed to list pages' }, 500)
  }
})

// Get page by ID
pages.get('/:id', (c) => {
  try {
    const db = getDB()
    const row = db.query('SELECT definition FROM pages WHERE id = ?').get(c.req.param('id')) as { definition: string } | null

    if (!row) {
      return c.json({ error: 'Page not found' }, 404)
    }

    return c.json(JSON.parse(row.definition))
  } catch (error) {
    return c.json({ error: 'Failed to fetch page' }, 500)
  }
})

// Get page by route
pages.get('/by-route/*', (c) => {
  try {
    const route = '/' + (c.req.param('*') || '')
    const normalizedRoute = route === '//' ? '/' : route

    const db = getDB()
    const row = db.query('SELECT definition FROM pages WHERE route = ?').get(normalizedRoute) as { definition: string } | null

    if (!row) {
      return c.json({ error: 'Page not found' }, 404)
    }

    return c.json(JSON.parse(row.definition))
  } catch (error) {
    return c.json({ error: 'Failed to fetch page' }, 500)
  }
})

export default pages
