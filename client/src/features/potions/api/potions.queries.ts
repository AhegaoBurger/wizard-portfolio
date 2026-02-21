import { queryOptions } from '@tanstack/react-query'
import { fetchAPI } from '@/shared/lib/api-client'
import type { ToolsData } from '@shared/types'

export const potionsKeys = {
  all: ['potions'] as const,
  tools: () => [...potionsKeys.all, 'tools'] as const,
}

export const toolsQueryOptions = queryOptions({
  queryKey: potionsKeys.tools(),
  queryFn: () => fetchAPI<ToolsData>('/content/tools'),
  select: (data) => data.tools,
})
