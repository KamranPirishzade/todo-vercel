import type { NextFunction, Request, Response } from 'express'
import type { ZodTypeAny } from 'zod'
import { HttpError } from './httpError.js'

type Source = 'body' | 'query' | 'params'

export function validate(schema: ZodTypeAny, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join('.') || source}: ${issue.message}`)
        .join('; ')
      next(new HttpError(400, message))
      return
    }
    req[source] = result.data
    next()
  }
}
