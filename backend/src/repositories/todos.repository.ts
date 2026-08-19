import { prisma } from '../db/prisma.js'
import type { FilterType, SortType, Todo } from '../types/todo.js'

function whereForFilter(filter: FilterType) {
  if (filter === 'active') return { completed: false }
  if (filter === 'completed') return { completed: true }
  return {}
}

function orderByForSort(sort?: SortType) {
  if (sort === 'alphabetical') return { text: 'asc' as const }
  if (sort === 'status') return { completed: 'asc' as const }
  return { id: 'asc' as const }
}

export const todosRepository = {
  findMany(filter: FilterType, sort?: SortType): Promise<Todo[]> {
    return prisma.todo.findMany({
      where: whereForFilter(filter),
      orderBy: orderByForSort(sort),
    })
  },

  findById(id: number): Promise<Todo | null> {
    return prisma.todo.findUnique({ where: { id } })
  },

  create(text: string): Promise<Todo> {
    return prisma.todo.create({ data: { text } })
  },

  update(id: number, data: Partial<Pick<Todo, 'text' | 'completed'>>): Promise<Todo> {
    return prisma.todo.update({ where: { id }, data })
  },

  remove(id: number): Promise<void> {
    return prisma.todo.delete({ where: { id } }).then(() => undefined)
  },

  removeCompleted(): Promise<number> {
    return prisma.todo
      .deleteMany({ where: { completed: true } })
      .then((result) => result.count)
  },
}
