import { prisma } from '../db/prisma.js'
import type { Prisma } from '@prisma/client'

type FilterType = 'all' | 'active' | 'completed'

function whereForFilter(filter?: FilterType): Prisma.TodoWhereInput {
  if (filter === 'active') return { completed: false }
  if (filter === 'completed') return { completed: true }
  return {}
}

export const todosService = {
  list(filter?: FilterType) {
    return prisma.todo.findMany({
      where: whereForFilter(filter),
      orderBy: { id: 'asc' },
    })
  },

  create(text: string) {
    return prisma.todo.create({ data: { text } })
  },

  update(id: number, data: { text?: string; completed?: boolean }) {
    return prisma.todo.update({ where: { id }, data })
  },

  remove(id: number) {
    return prisma.todo.delete({ where: { id } })
  },

  clearCompleted() {
    return prisma.todo.deleteMany({ where: { completed: true } })
  },

  find(id: number) {
    return prisma.todo.findUnique({ where: { id } })
  },
}
