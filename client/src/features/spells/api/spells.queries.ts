import { queryOptions } from '@tanstack/react-query'
import { fetchAPI } from '@/shared/lib/api-client'
import type { SpellsData } from '@shared/types'

export const spellsKeys = {
  all: ['spells'] as const,
  list: () => [...spellsKeys.all, 'list'] as const,
}

export const spellsQueryOptions = queryOptions({
  queryKey: spellsKeys.list(),
  queryFn: () => fetchAPI<SpellsData>('/content/spells'),
  select: (data) => data.spells,
})
