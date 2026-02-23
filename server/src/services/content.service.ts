import { readFile } from 'fs/promises'
import { join } from 'path'
import type {
  Profile,
  ProjectsData,
  SkillsData,
  SpellsData,
  ToolsData,
  TrashData,
  SkillTreeData,
  QuestLogData,
  LaboratoryData
} from '../../../shared/types/index.js'

const PROJECT_ROOT = process.cwd()
const CONTENT_DIR = join(PROJECT_ROOT, 'content')

// Simple in-memory cache
const cache = new Map<string, any>()
const CACHE_TTL = process.env.NODE_ENV === 'production' ? 60000 : 0 // 1 min in prod, no cache in dev

async function readJSON<T>(filename: string): Promise<T> {
  const now = Date.now()
  const cached = cache.get(filename)

  // Return cached data if available and not expired
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  try {
    const filepath = join(CONTENT_DIR, filename)
    const content = await readFile(filepath, 'utf-8')
    const data = JSON.parse(content) as T

    // Cache the data
    cache.set(filename, { data, timestamp: now })

    return data
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    throw new Error(`Failed to load content: ${filename}`)
  }
}

export const getProfile = () => readJSON<Profile>('profile.json')
export const getProjects = () => readJSON<ProjectsData>('projects.json')
export const getSkills = () => readJSON<SkillsData>('skills.json')
export const getSpells = () => readJSON<SpellsData>('spells.json')
export const getTools = () => readJSON<ToolsData>('tools.json')
export const getTrash = () => readJSON<TrashData>('trash.json')
export const getSkillTree = () => readJSON<SkillTreeData>('skill-tree.json')
export const getQuestLog = () => readJSON<QuestLogData>('quest-log.json')
export const getLaboratory = () => readJSON<LaboratoryData>('laboratory.json')

// Future DB migration example:
// export const getProjects = async () => {
//   const projects = await db.select().from(projectsTable)
//   return { projects }
// }
