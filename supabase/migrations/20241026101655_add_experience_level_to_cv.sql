-- Check if the experience_level enum type already exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level') THEN
        -- Create enum for experience level if it doesn't exist
        CREATE TYPE experience_level AS ENUM ('junior', 'mid', 'senior');
    END IF;
END $$;

-- Add experience_level column to cvs table
ALTER TABLE cvs
ADD COLUMN experience_level experience_level;

-- Create index on experience_level column
CREATE INDEX cvs_experience_level_idx ON cvs (experience_level);