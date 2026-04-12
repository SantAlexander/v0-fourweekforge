-- Add goal and start_date columns to plans table
ALTER TABLE plans ADD COLUMN IF NOT EXISTS goal TEXT;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS start_date DATE;
