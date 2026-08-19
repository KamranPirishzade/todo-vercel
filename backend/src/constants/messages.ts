export const ErrorMessages = {
  TODO_NOT_FOUND: 'Todo not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  TEXT_REQUIRED: 'text must not be empty',
  UPDATE_REQUIRES_FIELD: 'at least one of text or completed must be provided',
} as const

export function routeNotFoundMessage(method: string, path: string): string {
  return `Route not found: ${method} ${path}`
}

export function missingEnvVarMessage(name: string): string {
  return `Missing required environment variable: ${name}`
}
