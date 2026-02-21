import { queryOptions } from '@tanstack/react-query'
import { fetchAPI } from '@/shared/lib/api-client'
import type { QuestLogData } from '@shared/types'

export const questLogKeys = {
  all: ['quest-log'] as const,
  data: () => [...questLogKeys.all, 'data'] as const,
}

export const questLogQueryOptions = queryOptions({
  queryKey: questLogKeys.data(),
  queryFn: () => fetchAPI<QuestLogData>('/content/quest-log'),
})
