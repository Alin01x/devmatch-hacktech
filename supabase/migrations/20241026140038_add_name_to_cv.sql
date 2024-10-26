-- Add name column to cvs table
ALTER TABLE cvs
ADD COLUMN name TEXT NOT NULL DEFAULT '';