import { Router } from 'express'
import { todosRouter } from './todos.routes.js'

export const apiRouter = Router()

apiRouter.use('/todos', todosRouter)
