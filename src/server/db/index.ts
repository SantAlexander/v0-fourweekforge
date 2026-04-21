// Server - Database initialization
// Neon PostgreSQL connection pool

import { sql } from '@neon/serverless'

export const db = {
  query: async (query: string, params?: any[]) => {
    try {
      const result = await sql(query, params)
      return result
    } catch (error) {
      console.error('Database error:', error)
      throw error
    }
  },

  transaction: async (callback: () => Promise<void>) => {
    try {
      await sql('BEGIN')
      await callback()
      await sql('COMMIT')
    } catch (error) {
      await sql('ROLLBACK')
      throw error
    }
  },
}
