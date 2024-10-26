-- Create enum for experience level
CREATE TYPE experience_level AS ENUM ('junior', 'mid', 'senior');

-- Create the job_descriptions table with JSONB skills
CREATE TABLE job_descriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    detailed_description TEXT NOT NULL,
    experience_level experience_level NOT NULL,
    -- Store skills as JSONB: { "Python": 80, "React": 60, "SQL": 40 }
    skills JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create GIN index for faster JSONB queries
CREATE INDEX idx_job_skills_gin ON job_descriptions USING GIN (skills);