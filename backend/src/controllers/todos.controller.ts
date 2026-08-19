import type { Request, Response } from 'express'
import type { z } from 'zod'
import { HttpStatus } from '../constants/httpStatus.js'
import { todosService } from '../services/todos.service.js'
import {
  createTodoSchema,
  listTodosQuerySchema,
  todoIdParamSchema,
  updateTodoSchema,
} from '../validators/todos.validator.js'

type ListQuery = z.infer<typeof listTodosQuerySchema>
type CreateBody = z.infer<typeof createTodoSchema>
type UpdateBody = z.infer<typeof updateTodoSchema>
type IdParam = z.infer<typeof todoIdParamSchema>

export const todosController = {
  async list(req: Request, res: Response) {
    const { filter, sort } = req.query as unknown as ListQuery
    const todos = await todosService.list(filter, sort)
    res.json(todos)
  },

  async create(req: Request, res: Response) {
    const { text } = req.body as CreateBody
    const todo = await todosService.create(text)
    res.status(HttpStatus.CREATED).json(todo)
  },

  async update(req: Request, res: Response) {
    const { id } = req.params as unknown as IdParam
    const data = req.body as UpdateBody
    const todo = await todosService.update(id, data)
    res.json(todo)
  },

  async remove(req: Request, res: Response) {
    const { id } = req.params as unknown as IdParam
    await todosService.remove(id)
    res.status(HttpStatus.NO_CONTENT).send()
  },

  async clearCompleted(_req: Request, res: Response) {
    await todosService.clearCompleted()
    res.status(HttpStatus.NO_CONTENT).send()
  },
}
