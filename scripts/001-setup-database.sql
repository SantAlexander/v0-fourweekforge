-- FourWeekForge Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hobbies table
CREATE TABLE IF NOT EXISTS hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hobby_id UUID NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
  name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  week_index INTEGER NOT NULL CHECK (week_index >= 1 AND week_index <= 4),
  day_index INTEGER NOT NULL CHECK (day_index >= 1 AND day_index <= 7),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  materials TEXT,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_plan_id ON tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Seed hobbies data
INSERT INTO hobbies (id, name, description, icon) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Drawing', 'Master the fundamentals of drawing, from basic shapes to advanced shading techniques. Materials: pencils, sketchbook, eraser.', 'pencil'),
  ('22222222-2222-2222-2222-222222222222', 'Cooking', 'Learn essential cooking techniques and create delicious meals from scratch. Materials: basic kitchen equipment, fresh ingredients.', 'chef-hat'),
  ('33333333-3333-3333-3333-333333333333', 'Calligraphy', 'Discover the art of beautiful handwriting with traditional and modern styles. Materials: calligraphy pens, quality paper, ink.', 'pen-tool'),
  ('44444444-4444-4444-4444-444444444444', 'Photography', 'Capture stunning images by mastering composition, lighting, and editing. Materials: camera or smartphone, editing software.', 'camera'),
  ('55555555-5555-5555-5555-555555555555', 'Guitar', 'Play your favorite songs by learning chords, strumming patterns, and music theory. Materials: acoustic or electric guitar, picks, tuner.', 'music'),
  ('66666666-6666-6666-6666-666666666666', 'Yoga', 'Improve flexibility, strength, and mindfulness through daily yoga practice. Materials: yoga mat, comfortable clothing.', 'heart'),
  ('77777777-7777-7777-7777-777777777777', 'Writing', 'Develop your creative writing skills from journaling to storytelling. Materials: notebook, pen, or writing software.', 'book-open'),
  ('88888888-8888-8888-8888-888888888888', 'Gardening', 'Grow your own plants and create a beautiful garden oasis. Materials: seeds, soil, pots, basic gardening tools.', 'leaf')
ON CONFLICT (id) DO NOTHING;
