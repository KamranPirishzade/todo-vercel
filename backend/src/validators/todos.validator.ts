import { z } from 'zod'
import { TODO_TEXT_MAX_LENGTH } from '../constants/app.js'
import { ErrorMessages } from '../constants/messages.js'
import { FILTER_VALUES, SORT_VALUES } from '../types/todo.js'

export const listTodosQuerySchema = z.object({
  filter: z.enum(FILTER_VALUES).default('all'),
  sort: z.enum(SORT_VALUES).optional(),
})

export const createTodoSchema = z.object({
  text: z.string().trim().min(1, ErrorMessages.TEXT_REQUIRED).max(TODO_TEXT_MAX_LENGTH),
})

export const updateTodoSchema = z
  .object({
    text: z.string().trim().min(1, ErrorMessages.TEXT_REQUIRED).max(TODO_TEXT_MAX_LENGTH).optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => data.text !== undefined || data.completed !== undefined, {
    message: ErrorMessages.UPDATE_REQUIRES_FIELD,
  })

export const todoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})
