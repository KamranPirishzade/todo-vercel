import { cpSync } from 'node:fs'

cpSync('src/docs', 'dist/docs', { recursive: true })
