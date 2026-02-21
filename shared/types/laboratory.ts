export interface Experiment {
  id: string
  name: string
  description: string
  status: 'in-progress' | 'completed' | 'planned'
  tech: string[]
  progress: number
}

export interface Study {
  id: string
  name: string
  type: 'course' | 'paper' | 'book' | 'tutorial'
  status: 'in-progress' | 'completed' | 'planned'
  progress: number
}

export interface LaboratoryData {
  experiments: Experiment[]
  studies: Study[]
}
