export interface Project {
  id: string
  name: string
  type: string
  difficulty?: number // 1-5 scale
  completion: number
  challenge?: string
  approach?: string
  outcome?: string
  tech?: string[]
  description: string
  features: string[]
  featured?: boolean
  link?: string
  progress?: number // For backwards compatibility with summary view
}

export interface ProjectsData {
  projects: Project[]
}
