import { useEffect, useState } from 'react'
import { FilterType, SortType, Todo } from '../types'
import { todoApi } from '../services/todoApi'

function toMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('alphabetical')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    todoApi
      .list('all')
      .then((data) => {
        if (!cancelled) setTodos(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(toMessage(err, 'Failed to load todos'))
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    todoApi
      .list(filter, sort)
      .then((data) => {
        if (!cancelled) setFilteredTodos(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(toMessage(err, 'Failed to load todos'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [filter, sort])

  const refresh = async () => {
    const [all, filtered] = await Promise.all([
      todoApi.list('all'),
      todoApi.list(filter, sort),
    ])
    setTodos(all)
    setFilteredTodos(filtered)
  }

  const addTodo = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    try {
      await todoApi.create(trimmed)
      await refresh()
    } catch (err) {
      setError(toMessage(err, 'Failed to add todo'))
    }
  }

  const toggleTodo = async (id: number) => {
    const target = todos.find((t) => t.id === id)
    if (!target) return
    try {
      await todoApi.update(id, { completed: !target.completed })
      await refresh()
    } catch (err) {
      setError(toMessage(err, 'Failed to update todo'))
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.remove(id)
      await refresh()
    } catch (err) {
      setError(toMessage(err, 'Failed to delete todo'))
    }
  }

  const editTodo = async (id: number, newText: string) => {
    const trimmed = newText.trim()
    if (!trimmed) return
    try {
      await todoApi.update(id, { text: trimmed })
      await refresh()
    } catch (err) {
      setError(toMessage(err, 'Failed to edit todo'))
    }
  }

  const clearCompleted = async () => {
    try {
      await todoApi.clearCompleted()
      await refresh()
    } catch (err) {
      setError(toMessage(err, 'Failed to clear completed todos'))
    }
  }

  const activeCount = todos.filter((t) => !t.completed).length

  return {
    todos,
    filteredTodos,
    activeCount,
    filter,
    setFilter,
    sort,
    setSort,
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
