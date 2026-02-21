import { useQuery } from '@tanstack/react-query'
import { toolsQueryOptions } from './potions.queries'

export function useTools() {
  const { data, isLoading, error } = useQuery(toolsQueryOptions)

  return {
    tools: data ?? [],
    loading: isLoading,
    error: error ?? null,
  }
}
