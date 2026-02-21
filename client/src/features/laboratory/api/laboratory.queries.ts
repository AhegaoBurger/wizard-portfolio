import { queryOptions } from '@tanstack/react-query'
import { fetchAPI } from '@/shared/lib/api-client'
import type { LaboratoryData } from '@shared/types'

export const laboratoryKeys = {
  all: ['laboratory'] as const,
  data: () => [...laboratoryKeys.all, 'data'] as const,
}

export const laboratoryQueryOptions = queryOptions({
  queryKey: laboratoryKeys.data(),
  queryFn: () => fetchAPI<LaboratoryData>('/content/laboratory'),
})
