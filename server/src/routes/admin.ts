import { Hono } from 'hono'
import { getDB } from '../db/database.js'
import { seedDatabase } from '../db/seed.js'
import { adminAuth } from '../middleware/auth.js'

const admin = new Hono()

// Apply auth to all admin routes
admin.use('*', adminAuth)

// Update page definition
admin.put('/pages/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    // Validate that it has required structure
    if (!body.meta || !body.schema || !body.layout || !body.data) {
      return c.json({ error: 'Invalid page definition: missing required fields (meta, schema, layout, data)' }, 400)
    }

    const db = getDB()
    const existing = db.query('SELECT id FROM pages WHERE id = ?').get(id) as { id: string } | null

    if (!existing) {
      return c.json({ error: 'Page not found' }, 404)
    }

    db.prepare(`
      UPDATE pages SET
        title = ?,
        route = ?,
        definition = ?,
        version = version + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(body.meta.title, body.meta.route, JSON.stringify(body), id)

    return c.json({ success: true, id })
  } catch (error) {
    return c.json({ error: 'Failed to update page' }, 500)
  }
})

// Create new page
admin.post('/pages', async (c) => {
  try {
    const body = await c.req.json()

    if (!body.meta?.id || !body.meta?.route || !body.meta?.title) {
      return c.json({ error: 'Invalid page definition: missing meta (id, route, title)' }, 400)
    }

    const db = getDB()
    const existing = db.query('SELECT id FROM pages WHERE id = ?').get(body.meta.id) as { id: string } | null

    if (existing) {
      return c.json({ error: 'Page already exists' }, 409)
    }

    db.prepare(`
      INSERT INTO pages (id, route, title, definition, version)
      VALUES (?, ?, ?, ?, 1)
    `).run(body.meta.id, body.meta.route, body.meta.title, JSON.stringify(body))

    return c.json({ success: true, id: body.meta.id }, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create page' }, 500)
  }
})

// Delete page
admin.delete('/pages/:id', (c) => {
  try {
    const id = c.req.param('id')
    const db = getDB()

    const existing = db.query('SELECT id FROM pages WHERE id = ?').get(id) as { id: string } | null

    if (!existing) {
      return c.json({ error: 'Page not found' }, 404)
    }

    db.prepare('DELETE FROM pages WHERE id = ?').run(id)

    return c.json({ success: true, id })
  } catch (error) {
    return c.json({ error: 'Failed to delete page' }, 500)
  }
})

// Force re-seed
admin.post('/seed', (c) => {
  try {
    const force = c.req.query('force') === 'true'
    seedDatabase(force)
    return c.json({ success: true, message: 'Database seeded' })
  } catch (error) {
    return c.json({ error: 'Failed to seed database' }, 500)
  }
})

export default admin
