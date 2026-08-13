import { Router } from 'express'
import { todosController } from '../controllers/todos.controller.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import {
  createTodoSchema,
  listTodosQuerySchema,
  todoIdParamSchema,
  updateTodoSchema,
} from '../validators/todos.validator.js'

export const todosRouter = Router()

todosRouter.get(
  '/',
  validate(listTodosQuerySchema, 'query'),
  asyncHandler(todosController.list)
)

todosRouter.post(
  '/',
  validate(createTodoSchema, 'body'),
  asyncHandler(todosController.create)
)

todosRouter.delete('/clear-completed', asyncHandler(todosController.clearCompleted))

todosRouter.patch(
  '/:id',
  validate(todoIdParamSchema, 'params'),
  validate(updateTodoSchema, 'body'),
  asyncHandler(todosController.update)
)

todosRouter.delete(
  '/:id',
  validate(todoIdParamSchema, 'params'),
  asyncHandler(todosController.remove)
)
