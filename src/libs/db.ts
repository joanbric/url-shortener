import { createClient } from '@libsql/client'
const {TURSO_URL, TURSO_AUTH_TOKEN} =  import.meta.env

if (!TURSO_URL || !TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_URL and TURSO_AUTH_TOKEN must be set in environment variables');
}

export const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
})
