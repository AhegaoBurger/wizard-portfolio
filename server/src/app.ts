import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import contentRoutes from './routes/content.js'
import pagesRoutes from './routes/pages.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: !!(process.env.CLIENT_URL),
}))

// API Routes (portable — no Bun-specific dependencies)
app.route('/api/content', contentRoutes)
app.route('/api/pages', pagesRoutes)

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
