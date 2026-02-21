import { useQuery } from '@tanstack/react-query'
import { projectsQueryOptions } from './grimoire.queries'

export function useProjects() {
  const { data, isLoading, error } = useQuery(projectsQueryOptions)

  return {
    projects: data ?? [],
    loading: isLoading,
    error: error ?? null,
  }
}
