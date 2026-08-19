import type { NextFunction, Request, Response } from 'express'
import { HttpStatus } from '../constants/httpStatus.js'
import { ErrorMessages } from '../constants/messages.js'
import { HttpError } from './httpError.js'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }

  console.error(err)
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: ErrorMessages.INTERNAL_SERVER_ERROR })
}
