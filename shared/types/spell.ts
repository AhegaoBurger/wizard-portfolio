export interface Spell {
  id: string
  name: string
  type: string
  level: number // 1-5 scale
  description: string
  icon: string
  castable?: boolean
}

export interface SpellsData {
  spells: Spell[]
}
