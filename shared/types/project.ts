export interface Project {
  id: string
  name: string
  type: string
  completion: number
  description: string
  features: string[]
  featured?: boolean
  link?: string
  progress?: number // For backwards compatibility with summary view
}

export interface ProjectsData {
  projects: Project[]
}
