import { Hono } from 'hono'
import { listPages, getPageById, getPageByRoute } from '../services/pages.service.js'

const pages = new Hono()

// List all pages (summary)
pages.get('/', (c) => {
  try {
    const rows = listPages()
    return c.json(rows)
  } catch (error) {
    return c.json({ error: 'Failed to list pages' }, 500)
  }
})

// Get page by ID
pages.get('/:id', (c) => {
  try {
    const page = getPageById(c.req.param('id'))

    if (!page) {
      return c.json({ error: 'Page not found' }, 404)
    }

    return c.json(page)
  } catch (error) {
    return c.json({ error: 'Failed to fetch page' }, 500)
  }
})

// Get page by route
pages.get('/by-route/*', (c) => {
  try {
    const route = '/' + (c.req.param('*') || '')
    const normalizedRoute = route === '//' ? '/' : route

    const page = getPageByRoute(normalizedRoute)

    if (!page) {
      return c.json({ error: 'Page not found' }, 404)
    }

    return c.json(page)
  } catch (error) {
    return c.json({ error: 'Failed to fetch page' }, 500)
  }
})

export default pages
