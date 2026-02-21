import { useQuery } from '@tanstack/react-query'
import { spellsQueryOptions } from './spells.queries'

export function useSpells() {
  const { data, isLoading, error } = useQuery(spellsQueryOptions)

  return {
    spells: data ?? [],
    loading: isLoading,
    error: error ?? null,
  }
}
