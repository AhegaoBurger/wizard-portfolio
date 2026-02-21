import { fetchAPI } from '@/shared/lib/api-client'
import type { PageDefinition } from '@/features/renderer/types'

const API_BASE = (import.meta.env as any).VITE_API_URL || '/api'

interface PageSummary {
  id: string
  route: string
  title: string
  version: number
  updated_at: string
}

export async function listPages(): Promise<PageSummary[]> {
  return fetchAPI<PageSummary[]>('/pages')
}

export async function getPage(id: string): Promise<PageDefinition> {
  return fetchAPI<PageDefinition>(`/pages/${id}`)
}

export async function updatePage(id: string, definition: PageDefinition, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/admin/pages/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(definition),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || 'Failed to update page')
  }
}

export async function createPage(definition: PageDefinition, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/admin/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(definition),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || 'Failed to create page')
  }
}

export async function deletePage(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/admin/pages/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || 'Failed to delete page')
  }
}
