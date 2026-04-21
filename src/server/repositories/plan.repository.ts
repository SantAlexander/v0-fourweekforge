// Server - Plan Repository
// Data access layer for plans

import { db } from '../db'
import type { Plan } from '@/shared/types'

export const PlanRepository = {
  async findById(id: string): Promise<Plan | null> {
    const result = await db.query(
      'SELECT * FROM plans WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  },

  async findByUserId(userId: string): Promise<Plan[]> {
    const result = await db.query(
      'SELECT * FROM plans WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return result.rows
  },

  async create(data: Partial<Plan>): Promise<Plan> {
    const result = await db.query(
      `INSERT INTO plans (user_id, hobby_name, hobby_icon, goal, status, progress, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.userId,
        data.hobbyName,
        data.hobbyIcon,
        data.goal,
        data.status || 'active',
        data.progress || 0,
        data.startDate,
        data.endDate,
      ]
    )
    return result.rows[0]
  },

  async update(id: string, data: Partial<Plan>): Promise<Plan | null> {
    const fields = Object.entries(data)
      .map(([key, _], idx) => `${key} = $${idx + 2}`)
      .join(', ')
    
    const result = await db.query(
      `UPDATE plans SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, ...Object.values(data)]
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM plans WHERE id = $1', [id])
    return result.rowCount > 0
  },
}
