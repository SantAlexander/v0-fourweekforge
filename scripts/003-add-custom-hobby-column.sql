-- Add custom_hobby_name column to plans table
-- This column stores the name of custom hobby when user enters their own hobby
ALTER TABLE plans ADD COLUMN IF NOT EXISTS custom_hobby_name VARCHAR(255);
