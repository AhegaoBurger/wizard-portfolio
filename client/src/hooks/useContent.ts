import { useState, useEffect } from 'react'
import { api } from '@/services/api'
import type {
  Profile,
  Project,
  Skill,
  Spell,
  Tool,
  TrashItem
} from '@shared/types'

interface ContentState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

function useContentBase<T>(
  fetcher: () => Promise<T>
): ContentState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    fetcher()
      .then(result => {
        if (mounted) {
          setData(result)
          setLoading(false)
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { data, loading, error }
}

export function useProfile() {
  const { data, loading, error } = useContentBase(api.getProfile)
  return { profile: data, loading, error }
}

export function useProjects() {
  const { data, loading, error } = useContentBase(api.getProjects)
  return {
    projects: data?.projects || [],
    loading,
    error
  }
}

export function useSkills() {
  const { data, loading, error } = useContentBase(api.getSkills)
  return {
    skills: data?.skills || [],
    loading,
    error
  }
}

export function useSpells() {
  const { data, loading, error } = useContentBase(api.getSpells)
  return {
    spells: data?.spells || [],
    loading,
    error
  }
}

export function useTools() {
  const { data, loading, error } = useContentBase(api.getTools)
  return {
    tools: data?.tools || [],
    loading,
    error
  }
}

export function useTrash() {
  const { data, loading, error } = useContentBase(api.getTrash)
  return {
    items: data?.items || [],
    loading,
    error
  }
}
