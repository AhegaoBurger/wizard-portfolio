export interface Tool {
  id: string
  name: string
  category: string
  mastery: number // 0-100 scale
  description: string
  uses: string[]
  link?: string
}

export interface ToolsData {
  tools: Tool[]
}
