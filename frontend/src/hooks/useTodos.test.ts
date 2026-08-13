import { renderHook, act, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import useTodos from './useTodos'
import { todoApi } from '../services/todoApi'

vi.mock('../services/todoApi', () => ({
  todoApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    clearCompleted: vi.fn(),
  },
}))

const mockedApi = vi.mocked(todoApi)

let nextId = 1
function makeTodo(text: string, completed = false) {
  return { id: nextId++, text, completed }
}

async function renderLoadedTodos() {
  const hook = renderHook(() => useTodos())
  await waitFor(() => expect(hook.result.current.loading).toBe(false))
  return hook
}

describe('useTodos', () => {
  beforeEach(() => {
    nextId = 1
    vi.resetAllMocks()
    mockedApi.list.mockResolvedValue([])
  })

  it('starts with empty todos after loading', async () => {
    const { result } = await renderLoadedTodos()
    expect(result.current.todos).toEqual([])
    expect(result.current.activeCount).toBe(0)
  })

  it('addTodo appends the todo returned by the API', async () => {
    const { result } = await renderLoadedTodos()
    mockedApi.create.mockResolvedValue(makeTodo('Buy milk'))

    await act(async () => {
      await result.current.addTodo('Buy milk')
    })

    expect(mockedApi.create).toHaveBeenCalledWith('Buy milk')
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Buy milk')
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('addTodo trims whitespace before calling the API', async () => {
    const { result } = await renderLoadedTodos()
    mockedApi.create.mockResolvedValue(makeTodo('spaces'))

    await act(async () => {
      await result.current.addTodo('  spaces  ')
    })

    expect(mockedApi.create).toHaveBeenCalledWith('spaces')
  })

  it('toggleTodo flips completed via the API', async () => {
    const existing = makeTodo('Task')
    mockedApi.list.mockResolvedValue([existing])
    const { result } = await renderLoadedTodos()
    mockedApi.update.mockResolvedValue({ ...existing, completed: true })

    await act(async () => {
      await result.current.toggleTodo(existing.id)
    })

    expect(mockedApi.update).toHaveBeenCalledWith(existing.id, { completed: true })
    expect(result.current.todos[0].completed).toBe(true)
  })

  it('deleteTodo removes the todo once the API confirms', async () => {
    const existing = makeTodo('Task')
    mockedApi.list.mockResolvedValue([existing])
    const { result } = await renderLoadedTodos()
    mockedApi.remove.mockResolvedValue(undefined)

    await act(async () => {
      await result.current.deleteTodo(existing.id)
    })

    expect(mockedApi.remove).toHaveBeenCalledWith(existing.id)
    expect(result.current.todos).toHaveLength(0)
  })

  it('editTodo updates text via the API', async () => {
    const existing = makeTodo('Old text')
    mockedApi.list.mockResolvedValue([existing])
    const { result } = await renderLoadedTodos()
    mockedApi.update.mockResolvedValue({ ...existing, text: 'New text' })

    await act(async () => {
      await result.current.editTodo(existing.id, 'New text')
    })

    expect(mockedApi.update).toHaveBeenCalledWith(existing.id, { text: 'New text' })
    expect(result.current.todos[0].text).toBe('New text')
  })

  it('clearCompleted removes only completed todos once the API confirms', async () => {
    const active = makeTodo('Active')
    const done = makeTodo('Done', true)
    mockedApi.list.mockResolvedValue([active, done])
    const { result } = await renderLoadedTodos()
    mockedApi.clearCompleted.mockResolvedValue(undefined)

    await act(async () => {
      await result.current.clearCompleted()
    })

    expect(mockedApi.clearCompleted).toHaveBeenCalled()
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Active')
  })

  it('activeCount counts only incomplete todos', async () => {
    mockedApi.list.mockResolvedValue([makeTodo('A'), makeTodo('B', true)])
    const { result } = await renderLoadedTodos()
    expect(result.current.activeCount).toBe(1)
  })

  describe('filtering', () => {
    it('filter=all returns all todos', async () => {
      mockedApi.list.mockResolvedValue([makeTodo('A'), makeTodo('B', true)])
      const { result } = await renderLoadedTodos()
      expect(result.current.filteredTodos).toHaveLength(2)
    })

    it('filter=active returns only incomplete', async () => {
      mockedApi.list.mockResolvedValue([makeTodo('A'), makeTodo('B', true)])
      const { result } = await renderLoadedTodos()
      act(() => result.current.setFilter('active'))
      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].completed).toBe(false)
    })

    it('filter=completed returns only completed', async () => {
      mockedApi.list.mockResolvedValue([makeTodo('A'), makeTodo('B', true)])
      const { result } = await renderLoadedTodos()
      act(() => result.current.setFilter('completed'))
      expect(result.current.filteredTodos).toHaveLength(1)
      expect(result.current.filteredTodos[0].completed).toBe(true)
    })
  })

  it('surfaces an error message when loading todos fails', async () => {
    mockedApi.list.mockRejectedValue(new Error('Network error'))
    const { result } = await renderLoadedTodos()
    expect(result.current.error).toBe('Network error')
  })
})
