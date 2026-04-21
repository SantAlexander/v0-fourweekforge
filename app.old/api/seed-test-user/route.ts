import { sql } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { NextResponse } from 'next/server'

// Test credentials:
// Email: test@fourweekforge.com
// Password: test123456

export async function POST() {
  try {
    const testEmail = 'test@fourweekforge.com'
    const testPassword = 'test123456'
    const testName = 'Test User'

    // Check if test user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${testEmail}`
    
    if (existingUser.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Test user already exists',
        credentials: {
          email: testEmail,
          password: testPassword
        }
      })
    }

    // Create test user
    const passwordHash = await hashPassword(testPassword)
    const newUser = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${testEmail}, ${testName}, ${passwordHash})
      RETURNING id, email, name
    `

    // Create a sample plan with 28 tasks for the test user
    const userId = newUser[0].id
    const startDate = new Date().toISOString().split('T')[0]
    
    // Get a hobby (guitar)
    const hobby = await sql`SELECT id FROM hobbies WHERE name = 'Guitar' LIMIT 1`
    const hobbyId = hobby.length > 0 ? hobby[0].id : null

    const plan = await sql`
      INSERT INTO plans (user_id, hobby_id, goal, start_date, status)
      VALUES (${userId}, ${hobbyId}, 'Learn to play 5 songs on guitar', ${startDate}, 'active')
      RETURNING id
    `

    // Generate 28 tasks (7 per week)
    const tasks = [
      // Week 1 - Basics
      { week: 1, title: 'Learn guitar parts and anatomy', desc: 'Study the different parts of the guitar' },
      { week: 1, title: 'Practice proper posture', desc: 'Learn how to hold the guitar correctly' },
      { week: 1, title: 'Learn basic chords: C, G', desc: 'Practice transitioning between C and G chords' },
      { week: 1, title: 'Learn basic chords: D, Em', desc: 'Add D and Em to your chord vocabulary' },
      { week: 1, title: 'Practice chord transitions', desc: '15 minutes of chord switching practice' },
      { week: 1, title: 'Learn your first simple song', desc: 'Practice a 2-chord song' },
      { week: 1, title: 'Week 1 review and practice', desc: 'Consolidate what you learned this week' },
      
      // Week 2 - Building Foundation
      { week: 2, title: 'Learn Am and F chords', desc: 'Add two more essential chords' },
      { week: 2, title: 'Practice strumming patterns', desc: 'Learn basic down-up strumming' },
      { week: 2, title: 'Learn a 3-chord song', desc: 'Apply your chords to a real song' },
      { week: 2, title: 'Practice finger exercises', desc: 'Build finger strength and dexterity' },
      { week: 2, title: 'Learn basic music theory', desc: 'Understand chord progressions' },
      { week: 2, title: 'Practice song #2', desc: 'Learn another song with your chords' },
      { week: 2, title: 'Week 2 review session', desc: 'Practice all chords and songs' },
      
      // Week 3 - Intermediate Skills
      { week: 3, title: 'Learn barre chord basics', desc: 'Introduction to barre chord technique' },
      { week: 3, title: 'Practice B minor chord', desc: 'Master your first barre chord' },
      { week: 3, title: 'Learn fingerpicking basics', desc: 'Start with simple fingerpicking patterns' },
      { week: 3, title: 'Practice song #3', desc: 'Learn a song that uses your new skills' },
      { week: 3, title: 'Work on chord speed', desc: 'Practice quick chord changes' },
      { week: 3, title: 'Learn hammer-ons and pull-offs', desc: 'Add expression to your playing' },
      { week: 3, title: 'Week 3 review and jam', desc: 'Play through all your songs' },
      
      // Week 4 - Putting It Together
      { week: 4, title: 'Learn song #4', desc: 'A more challenging song' },
      { week: 4, title: 'Practice dynamics', desc: 'Learn to play soft and loud' },
      { week: 4, title: 'Record yourself playing', desc: 'Listen back and identify improvements' },
      { week: 4, title: 'Learn song #5', desc: 'Your final song for the challenge' },
      { week: 4, title: 'Polish all 5 songs', desc: 'Refine your performance of each song' },
      { week: 4, title: 'Final practice session', desc: 'Run through your entire repertoire' },
      { week: 4, title: 'Celebrate your progress!', desc: 'Perform your songs for someone' },
    ]

    for (const task of tasks) {
      await sql`
        INSERT INTO tasks (plan_id, week_number, title, description, is_completed)
        VALUES (${plan[0].id}, ${task.week}, ${task.title}, ${task.desc}, false)
      `
    }

    return NextResponse.json({
      success: true,
      message: 'Test user created with sample plan',
      credentials: {
        email: testEmail,
        password: testPassword
      }
    })
  } catch (error) {
    console.error('Error creating test user:', error)
    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 }
    )
  }
}
