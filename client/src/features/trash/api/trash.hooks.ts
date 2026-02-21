import { useQuery } from '@tanstack/react-query'
import { trashQueryOptions } from './trash.queries'

export function useTrash() {
  const { data, isLoading, error } = useQuery(trashQueryOptions)

  return {
    items: data ?? [],
    loading: isLoading,
    error: error ?? null,
  }
}
