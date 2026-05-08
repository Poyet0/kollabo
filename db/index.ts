import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env['DATABASE_URL']!

// En production : pooler PgBouncer — en développement : connexion directe
const client = postgres(connectionString, {
  prepare: false, // requis avec PgBouncer en mode transaction
})

export const db = drizzle(client, { schema })
export type DB = typeof db
