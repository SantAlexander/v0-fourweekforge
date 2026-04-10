import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

async function createTestUser() {
  const databaseUrl = process.env.NEON_DATABASE_URL
  if (!databaseUrl) {
    throw new Error('NEON_DATABASE_URL is not set')
  }
  
  const sql = neon(databaseUrl)
  
  const email = 'test@fourweekforge.com'
  const name = 'Test User'
  const password = 'test123456'
  
  // Hash the password (same as in auth.ts)
  const passwordHash = await bcrypt.hash(password, 12)
  
  // Check if user already exists
  const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`
  
  if (existingUser.length > 0) {
    console.log('Test user already exists!')
    return
  }
  
  // Create the test user
  const newUser = await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (${email}, ${name}, ${passwordHash})
    RETURNING id, email, name, created_at
  `
  
  console.log('Test user created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
  console.log('User:', newUser[0])
}

createTestUser().catch(console.error)
