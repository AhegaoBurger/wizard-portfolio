import { queryOptions } from '@tanstack/react-query'
import { fetchAPI } from '@/shared/lib/api-client'
import type { SkillTreeData } from '@shared/types'

export const spellbookKeys = {
  all: ['spellbook'] as const,
  tree: () => [...spellbookKeys.all, 'tree'] as const,
}

export const skillTreeQueryOptions = queryOptions({
  queryKey: spellbookKeys.tree(),
  queryFn: () => fetchAPI<SkillTreeData>('/content/skill-tree'),
})
