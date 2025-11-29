export interface Skill {
  id: string
  name: string
  category?: string
  level: number // 1-5 scale
  available?: boolean
  technologies?: string[]
}

export interface SkillsData {
  skills: Skill[]
}
