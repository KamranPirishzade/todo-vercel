import { useEffect, useState } from 'react'
import { FilterType, Todo } from '../types'
import { todoApi } from '../services/todoApi'

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    todoApi
      .list()
      .then((data) => {
        if (!cancelled) setTodos(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load todos')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const addTodo = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    try {
      const created = await todoApi.create(trimmed)
      setTodos((prev) => [...prev, created])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo')
    }
  }

  const toggleTodo = async (id: number) => {
    const target = todos.find((t) => t.id === id)
    if (!target) return
    try {
      const updated = await todoApi.update(id, { completed: !target.completed })
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo')
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.remove(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo')
    }
  }

  const editTodo = async (id: number, newText: string) => {
    const trimmed = newText.trim()
    if (!trimmed) return
    try {
      const updated = await todoApi.update(id, { text: trimmed })
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit todo')
    }
  }

  const clearCompleted = async () => {
    try {
      await todoApi.clearCompleted()
      setTodos((prev) => prev.filter((t) => !t.completed))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear completed todos')
    }
  }

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter((t) => !t.completed).length

  return {
    todos,
    filteredTodos,
    activeCount,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    loading,
    error,
  }
}

export default useTodos
