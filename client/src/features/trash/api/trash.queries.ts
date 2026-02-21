import { queryOptions } from '@tanstack/react-query'
import { fetchAPI } from '@/shared/lib/api-client'
import type { TrashData } from '@shared/types'

export const trashKeys = {
  all: ['trash'] as const,
  items: () => [...trashKeys.all, 'items'] as const,
}

export const trashQueryOptions = queryOptions({
  queryKey: trashKeys.items(),
  queryFn: () => fetchAPI<TrashData>('/content/trash'),
  select: (data) => data.items,
})
