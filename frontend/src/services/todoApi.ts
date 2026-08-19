import { FilterType, SortType, Todo } from '../types'

const DEFAULT_API_URL = 'http://localhost:4000/api'
const API_URL = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `Request failed with status ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

export const todoApi = {
  list(filter: FilterType = 'all', sort?: SortType): Promise<Todo[]> {
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('filter', filter)
    if (sort) params.set('sort', sort)
    const query = params.toString()
    return request<Todo[]>(`/todos${query ? `?${query}` : ''}`)
  },

  create(text: string): Promise<Todo> {
    return request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
  },

  update(id: number, data: { text?: string; completed?: boolean }): Promise<Todo> {
    return request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  remove(id: number): Promise<void> {
    return request<void>(`/todos/${id}`, { method: 'DELETE' })
  },

  clearCompleted(): Promise<void> {
    return request<void>('/todos/clear-completed', { method: 'DELETE' })
  },
}
