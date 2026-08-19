import 'dotenv/config'
import { DEFAULT_CORS_ORIGIN, DEFAULT_PORT } from '../constants/app.js'
import { missingEnvVarMessage } from '../constants/messages.js'

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(missingEnvVarMessage(name))
  }
  return value
}

export const env = {
  port: Number(process.env.PORT ?? DEFAULT_PORT),
  databaseUrl: required('DATABASE_URL'),
  corsOrigin: process.env.CORS_ORIGIN ?? DEFAULT_CORS_ORIGIN,
}
