-- Add listed_skills column as an array of strings
ALTER TABLE job_descriptions
ADD COLUMN listed_skills VARCHAR[] NOT NULL DEFAULT '{}';

-- Create GIN index for faster array queries
CREATE INDEX idx_job_listed_skills_gin ON job_descriptions USING GIN (listed_skills);