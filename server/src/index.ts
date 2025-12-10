import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import contentRoutes from './routes/content.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// API Routes
app.route('/api/content', contentRoutes)

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

console.log(`🧙 Wizard Portfolio Server starting on port ${port}`)
console.log(`📁 Serving content from ./content directory`)
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)

serve({
  fetch: app.fetch,
  port
})

export default app
