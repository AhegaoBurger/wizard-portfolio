import { serveStatic } from 'hono/bun'
import app from './app.js'
import adminRoutes from './routes/admin.js'
import { seedDatabase } from './db/seed.js'

// Bun-specific routes (admin requires bun:sqlite)
app.route('/api/admin', adminRoutes)

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
