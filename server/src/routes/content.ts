import { Hono } from 'hono'
import {
  getProfile,
  getProjects,
  getSkills,
  getSpells,
  getTools,
  getTrash,
  getSkillTree,
  getQuestLog,
  getLaboratory
} from '../services/content.service.js'

const content = new Hono()

content.get('/profile', async (c) => {
  try {
    const data = await getProfile()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

content.get('/projects', async (c) => {
  try {
    const data = await getProjects()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch projects' }, 500)
  }
})

content.get('/skills', async (c) => {
  try {
    const data = await getSkills()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch skills' }, 500)
  }
})

content.get('/spells', async (c) => {
  try {
    const data = await getSpells()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch spells' }, 500)
  }
})

content.get('/tools', async (c) => {
  try {
    const data = await getTools()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch tools' }, 500)
  }
})

content.get('/trash', async (c) => {
  try {
    const data = await getTrash()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch trash' }, 500)
  }
})

content.get('/skill-tree', async (c) => {
  try {
    const data = await getSkillTree()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch skill tree' }, 500)
  }
})

content.get('/quest-log', async (c) => {
  try {
    const data = await getQuestLog()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch quest log' }, 500)
  }
})

content.get('/laboratory', async (c) => {
  try {
    const data = await getLaboratory()
    return c.json(data)
  } catch (error) {
    return c.json({ error: 'Failed to fetch laboratory' }, 500)
  }
})

export default content
