const API_BASE = (import.meta.env as any).VITE_API_URL || '/api'

export async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`)

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}
