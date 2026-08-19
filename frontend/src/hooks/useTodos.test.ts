import { renderHook, act, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import useTodos from './useTodos'
import { todoApi } from '../services/todoApi'
import type { FilterType, SortType, Todo } from '../types'

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
let store: Todo[] = []

function applyView(filter: FilterType = 'all', sort?: SortType): Todo[] {
  let result = store
  if (filter === 'active') result = result.filter((t) => !t.completed)
  if (filter === 'completed') result = result.filter((t) => t.completed)
  result = [...result]
  if (sort === 'alphabetical') result.sort((a, b) => a.text.localeCompare(b.text))
  if (sort === 'status') result.sort((a, b) => Number(a.completed) - Number(b.completed))
  return result
}

function seed(todos: Array<Pick<Todo, 'text' | 'completed'>>) {
  store = todos.map((t) => ({ id: nextId++, text: t.text, completed: t.completed }))
}

async function renderLoadedTodos() {
  const hook = renderHook(() => useTodos())
  await waitFor(() => expect(hook.result.current.loading).toBe(false))
  return hook
}

describe('useTodos', () => {
  beforeEach(() => {
    nextId = 1
    store = []
    vi.resetAllMocks()

    mockedApi.list.mockImplementation((filter, sort) => Promise.resolve(applyView(filter, sort)))

    mockedApi.create.mockImplementation((text) => {
      const todo: Todo = { id: nextId++, text, completed: false }
      store = [...store, todo]
      return Promise.resolve(todo)
    })

    mockedApi.update.mockImplementation((id, data) => {
      store = store.map((t) => (t.id === id ? { ...t, ...data } : t))
      return Promise.resolve(store.find((t) => t.id === id) as Todo)
    })

    mockedApi.remove.mockImplementation((id) => {
      store = store.filter((t) => t.id !== id)
      return Promise.resolve(undefined)
    })

    mockedApi.clearCompleted.mockImplementation(() => {
      store = store.filter((t) => !t.completed)
      return Promise.resolve(undefined)
    })
  })

  it('starts with empty todos after loading', async () => {
    const { result } = await renderLoadedTodos()
    expect(result.current.todos).toEqual([])
    expect(result.current.filteredTodos).toEqual([])
    expect(result.current.activeCount).toBe(0)
  })

  it('addTodo creates the todo via the api and reflects it in state', async () => {
    const { result } = await renderLoadedTodos()

    await act(async () => {
      await result.current.addTodo('Buy milk')
    })

    expect(mockedApi.create).toHaveBeenCalledWith('Buy milk')
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.filteredTodos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Buy milk')
  })

  it('addTodo trims whitespace before calling the API', async () => {
    const { result } = await renderLoadedTodos()

    await act(async () => {
      await result.current.addTodo('  spaces  ')
    })

    expect(mockedApi.create).toHaveBeenCalledWith('spaces')
  })

  it('toggleTodo flips completed via the API', async () => {
    seed([{ text: 'Task', completed: false }])
    const { result } = await renderLoadedTodos()
    const id = result.current.todos[0].id

    await act(async () => {
      await result.current.toggleTodo(id)
    })

    expect(mockedApi.update).toHaveBeenCalledWith(id, { completed: true })
    expect(result.current.todos[0].completed).toBe(true)
  })

  it('deleteTodo removes the todo once the API confirms', async () => {
    seed([{ text: 'Task', completed: false }])
    const { result } = await renderLoadedTodos()
    const id = result.current.todos[0].id

    await act(async () => {
      await result.current.deleteTodo(id)
    })

    expect(mockedApi.remove).toHaveBeenCalledWith(id)
    expect(result.current.todos).toHaveLength(0)
  })

  it('editTodo updates text via the API', async () => {
    seed([{ text: 'Old text', completed: false }])
    const { result } = await renderLoadedTodos()
    const id = result.current.todos[0].id

    await act(async () => {
      await result.current.editTodo(id, 'New text')
    })

    expect(mockedApi.update).toHaveBeenCalledWith(id, { text: 'New text' })
    expect(result.current.todos[0].text).toBe('New text')
  })

  it('clearCompleted removes only completed todos once the API confirms', async () => {
    seed([
      { text: 'Active', completed: false },
      { text: 'Done', completed: true },
    ])
    const { result } = await renderLoadedTodos()

    await act(async () => {
      await result.current.clearCompleted()
    })

    expect(mockedApi.clearCompleted).toHaveBeenCalled()
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Active')
  })

  it('activeCount counts only incomplete todos regardless of the current filter', async () => {
    seed([
      { text: 'A', completed: false },
      { text: 'B', completed: true },
    ])
    const { result } = await renderLoadedTodos()
    expect(result.current.activeCount).toBe(1)
  })

  describe('filtering', () => {
    it('filter=all requests every todo from the api', async () => {
      seed([
        { text: 'A', completed: false },
        { text: 'B', completed: true },
      ])
      const { result } = await renderLoadedTodos()
      expect(result.current.filteredTodos).toHaveLength(2)
    })

    it('changing the filter refetches from the api with the new filter', async () => {
      seed([
        { text: 'A', completed: false },
        { text: 'B', completed: true },
      ])
      const { result } = await renderLoadedTodos()

      act(() => result.current.setFilter('active'))
      await waitFor(() => expect(result.current.filteredTodos).toHaveLength(1))

      expect(mockedApi.list).toHaveBeenLastCalledWith('active', 'alphabetical')
      expect(result.current.filteredTodos[0].completed).toBe(false)
    })

    it('changing the filter to completed refetches only completed todos', async () => {
      seed([
        { text: 'A', completed: false },
        { text: 'B', completed: true },
      ])
      const { result } = await renderLoadedTodos()

      act(() => result.current.setFilter('completed'))
      await waitFor(() => expect(result.current.filteredTodos).toHaveLength(1))

      expect(result.current.filteredTodos[0].completed).toBe(true)
    })
  })

  describe('sorting', () => {
    it('defaults to alphabetical sort', async () => {
      seed([
        { text: 'Banana', completed: false },
        { text: 'Apple', completed: false },
      ])
      const { result } = await renderLoadedTodos()

      expect(result.current.sort).toBe('alphabetical')
      expect(result.current.filteredTodos.map((t) => t.text)).toEqual(['Apple', 'Banana'])
    })

    it('changing sort to status refetches with active todos first', async () => {
      seed([
        { text: 'Done', completed: true },
        { text: 'Active', completed: false },
      ])
      const { result } = await renderLoadedTodos()

      act(() => result.current.setSort('status'))
      await waitFor(() => expect(mockedApi.list).toHaveBeenLastCalledWith('all', 'status'))

      expect(result.current.filteredTodos.map((t) => t.completed)).toEqual([false, true])
    })
  })

  it('surfaces an error message when loading todos fails', async () => {
    mockedApi.list.mockRejectedValue(new Error('Network error'))
    const { result } = await renderLoadedTodos()
    expect(result.current.error).toBe('Network error')
  })
})
