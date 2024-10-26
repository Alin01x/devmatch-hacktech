-- Remove experience_level column from cvs table
ALTER TABLE cvs DROP COLUMN experience_level;

-- Remove experience_level column from job_descriptions table
ALTER TABLE job_descriptions DROP COLUMN experience_level;