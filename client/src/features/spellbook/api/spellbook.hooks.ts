import { useQuery } from '@tanstack/react-query'
import { skillTreeQueryOptions } from './spellbook.queries'

export function useSkillTree() {
  const { data, isLoading, error } = useQuery(skillTreeQueryOptions)

  return {
    nodes: data?.nodes ?? [],
    connections: data?.connections ?? [],
    branches: data?.branches ?? [],
    loading: isLoading,
    error: error ?? null,
  }
}
