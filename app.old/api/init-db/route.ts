import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create hobbies table
    await sql`
      CREATE TABLE IF NOT EXISTS hobbies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        description TEXT
      )
    `

    // Create plans table
    await sql`
      CREATE TABLE IF NOT EXISTS plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        hobby_id UUID REFERENCES hobbies(id),
        custom_hobby_name VARCHAR(100),
        goal TEXT NOT NULL,
        start_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
        week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 4),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_plan_id ON tasks(plan_id)`

    // Check if hobbies exist
    const existingHobbies = await sql`SELECT COUNT(*) as count FROM hobbies`
    
    if (Number(existingHobbies[0].count) === 0) {
      // Insert seed hobbies
      await sql`
        INSERT INTO hobbies (name, icon, description) VALUES
        ('Guitar', 'guitar', 'Learn to play acoustic or electric guitar'),
        ('Painting', 'palette', 'Explore watercolor, acrylic, or oil painting'),
        ('Photography', 'camera', 'Master composition and lighting techniques'),
        ('Cooking', 'chef-hat', 'Discover new recipes and cooking techniques'),
        ('Yoga', 'flower-2', 'Practice poses and mindfulness'),
        ('Coding', 'code', 'Learn programming and build projects'),
        ('Writing', 'pen-tool', 'Develop creative or technical writing skills'),
        ('Drawing', 'pencil', 'Learn sketching and illustration techniques')
      `
    }

    return NextResponse.json({ success: true, message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
