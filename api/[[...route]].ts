import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import profile from '../content/profile.json'
import projects from '../content/projects.json'
import skills from '../content/skills.json'
import spells from '../content/spells.json'
import tools from '../content/tools.json'
import trash from '../content/trash.json'

export const config = {
  runtime: 'nodejs',
}

// Content is bundled at build time rather than read from disk: serverless
// functions have no reliable cwd, and the JSON is static anyway.
const app = new Hono().basePath('/api')

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/content/profile', (c) => c.json(profile))
app.get('/content/projects', (c) => c.json(projects))
app.get('/content/skills', (c) => c.json(skills))
app.get('/content/spells', (c) => c.json(spells))
app.get('/content/tools', (c) => c.json(tools))
app.get('/content/trash', (c) => c.json(trash))

export default handle(app)
