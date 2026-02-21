import type { MiddlewareHandler } from 'hono'

export const adminAuth: MiddlewareHandler = async (c, next) => {
  const token = process.env.EDITOR_TOKEN

  if (!token) {
    return c.json({ error: 'Editor token not configured' }, 503)
  }

  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Authorization required' }, 401)
  }

  const providedToken = authHeader.slice(7)

  if (providedToken !== token) {
    return c.json({ error: 'Invalid token' }, 403)
  }

  await next()
}
