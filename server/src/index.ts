import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'
import contentRoutes from './routes/content.js'
import pagesRoutes from './routes/pages.js'
import adminRoutes from './routes/admin.js'
import { seedDatabase } from './db/seed.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// API Routes
app.route('/api/content', contentRoutes)
app.route('/api/pages', pagesRoutes)
app.route('/api/admin', adminRoutes)

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files (production build)
if (process.env.NODE_ENV === 'production') {
  app.use('/*', serveStatic({ root: './dist/client' }))

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', serveStatic({ path: './dist/client/index.html' }))
}

const port = Number(process.env.PORT) || 3000

// Seed database on startup
try {
  seedDatabase()
} catch (error) {
  console.error('Failed to seed database:', error)
}

console.log(`Wizard Portfolio Server starting on port ${port}`)
console.log(`Serving content from ./content directory`)
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)

export default {
  port,
  fetch: app.fetch,
}
