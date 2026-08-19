import { HttpStatus } from '../constants/httpStatus.js'
import { ErrorMessages } from '../constants/messages.js'
import { todosRepository } from '../repositories/todos.repository.js'
import { HttpError } from '../middleware/httpError.js'
import type { FilterType, SortType } from '../types/todo.js'

export const todosService = {
  list(filter: FilterType, sort?: SortType) {
    return todosRepository.findMany(filter, sort)
  },

  create(text: string) {
    return todosRepository.create(text)
  },

  async update(id: number, data: { text?: string; completed?: boolean }) {
    const existing = await todosRepository.findById(id)
    if (!existing) {
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessages.TODO_NOT_FOUND)
    }
    return todosRepository.update(id, data)
  },

  async remove(id: number) {
    const existing = await todosRepository.findById(id)
    if (!existing) {
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessages.TODO_NOT_FOUND)
    }
    await todosRepository.remove(id)
  },

  clearCompleted() {
    return todosRepository.removeCompleted()
  },
}
