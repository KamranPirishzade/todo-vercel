import { z } from 'zod'

export const listTodosQuerySchema = z.object({
  filter: z.enum(['all', 'active', 'completed']).optional(),
})

export const createTodoSchema = z.object({
  text: z.string().trim().min(1, 'text must not be empty').max(200),
})

export const updateTodoSchema = z
  .object({
    text: z.string().trim().min(1, 'text must not be empty').max(200).optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => data.text !== undefined || data.completed !== undefined, {
    message: 'at least one of text or completed must be provided',
  })

export const todoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})
