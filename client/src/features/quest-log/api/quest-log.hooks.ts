import { useQuery } from '@tanstack/react-query'
import { questLogQueryOptions } from './quest-log.queries'

export function useQuestLog() {
  const { data, isLoading, error } = useQuery(questLogQueryOptions)

  return {
    activeQuests: data?.activeQuests ?? [],
    completedQuests: data?.completedQuests ?? [],
    loading: isLoading,
    error: error ?? null,
  }
}
