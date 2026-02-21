import { useQuery } from '@tanstack/react-query'
import { laboratoryQueryOptions } from './laboratory.queries'

export function useLaboratory() {
  const { data, isLoading, error } = useQuery(laboratoryQueryOptions)

  return {
    experiments: data?.experiments ?? [],
    studies: data?.studies ?? [],
    loading: isLoading,
    error: error ?? null,
  }
}
