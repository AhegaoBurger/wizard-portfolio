export type SkillLevel = 'mastered' | 'proficient' | 'learning' | 'planned'

export interface SkillNode {
  id: string
  name: string
  level: SkillLevel
  branch: string
  description: string
  x: number // 0-100 percentage
  y: number // 0-100 percentage
}

export interface SkillConnection {
  from: string
  to: string
  dashed?: boolean // cross-branch connections
}

export interface BranchLabel {
  name: string
  x: number
  y: number
}

export interface SkillTreeData {
  nodes: SkillNode[]
  connections: SkillConnection[]
  branches: BranchLabel[]
}
