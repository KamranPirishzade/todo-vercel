import type { Request, Response } from 'express'
import { todosService } from '../services/todos.service.js'

export const todosController = {
  async list(req: Request, res: Response) {
    const { filter } = req.query as { filter?: 'all' | 'active' | 'completed' }
    const todos = await todosService.list(filter)
    res.json(todos)
  },

  async create(req: Request, res: Response) {
    const { text } = req.body as { text: string }
    const todo = await todosService.create(text)
    res.status(201).json(todo)
  },

  async update(req: Request, res: Response) {
    const { id } = req.params as unknown as { id: number }
    const data = req.body as { text?: string; completed?: boolean }
    const todo = await todosService.update(id, data)
    res.json(todo)
  },

  async remove(req: Request, res: Response) {
    const { id } = req.params as unknown as { id: number }
    await todosService.remove(id)
    res.status(204).send()
  },

  async clearCompleted(_req: Request, res: Response) {
    await todosService.clearCompleted()
    res.status(204).send()
  },
}
