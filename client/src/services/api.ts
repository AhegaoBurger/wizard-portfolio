import type {
  Profile,
  ProjectsData,
  SkillsData,
  SpellsData,
  ToolsData,
  TrashData
} from '@shared/types'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  getProfile: () => fetchAPI<Profile>('/content/profile'),
  getProjects: () => fetchAPI<ProjectsData>('/content/projects'),
  getSkills: () => fetchAPI<SkillsData>('/content/skills'),
  getSpells: () => fetchAPI<SpellsData>('/content/spells'),
  getTools: () => fetchAPI<ToolsData>('/content/tools'),
  getTrash: () => fetchAPI<TrashData>('/content/trash'),
}
