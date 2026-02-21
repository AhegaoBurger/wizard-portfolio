import { queryOptions } from '@tanstack/react-query'
import { fetchAPI } from '@/shared/lib/api-client'
import type { ProjectsData } from '@shared/types'

export const grimoireKeys = {
  all: ['grimoire'] as const,
  projects: () => [...grimoireKeys.all, 'projects'] as const,
}

export const projectsQueryOptions = queryOptions({
  queryKey: grimoireKeys.projects(),
  queryFn: () => fetchAPI<ProjectsData>('/content/projects'),
  select: (data) => data.projects,
})
