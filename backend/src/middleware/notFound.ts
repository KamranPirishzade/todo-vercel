import type { Request, Response } from 'express'
import { HttpStatus } from '../constants/httpStatus.js'
import { routeNotFoundMessage } from '../constants/messages.js'

export function notFound(req: Request, res: Response) {
  res
    .status(HttpStatus.NOT_FOUND)
    .json({ error: routeNotFoundMessage(req.method, req.originalUrl) })
}
