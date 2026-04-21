// Server - Task Repository
// Data access layer for tasks

import { db } from '../db'
import type { Task } from '@/shared/types'

export const TaskRepository = {
  async findByPlanId(planId: string): Promise<Task[]> {
    const result = await db.query(
      'SELECT * FROM tasks WHERE plan_id = $1 ORDER BY week, day',
      [planId]
    )
    return result.rows
  },

  async findById(id: string): Promise<Task | null> {
    const result = await db.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  },

  async create(data: Partial<Task>): Promise<Task> {
    const result = await db.query(
      `INSERT INTO tasks (plan_id, title, description, week, day, is_completed)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.planId, data.title, data.description, data.week, data.day, false]
    )
    return result.rows[0]
  },

  async toggle(id: string): Promise<Task | null> {
    const result = await db.query(
      `UPDATE tasks SET is_completed = NOT is_completed, completed_at = CASE WHEN is_completed THEN NULL ELSE NOW() END WHERE id = $1 RETURNING *`,
      [id]
    )
    return result.rows[0] || null
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.query('DELETE FROM tasks WHERE id = $1', [id])
    return result.rowCount > 0
  },
}
