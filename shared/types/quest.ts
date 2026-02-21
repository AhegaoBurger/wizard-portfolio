export interface ActiveQuest {
  id: string
  name: string
  description: string
  objectives: string[]
  progress: number
  startDate: string
}

export interface CompletedQuest {
  id: string
  name: string
  description: string
  achievements: string[]
  period: string
}

export interface QuestLogData {
  activeQuests: ActiveQuest[]
  completedQuests: CompletedQuest[]
}
