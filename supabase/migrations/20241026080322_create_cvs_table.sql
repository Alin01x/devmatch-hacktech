-- Create CVs table
CREATE TABLE cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_content TEXT NOT NULL,
  industries TEXT[] NOT NULL,
  skills TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add full-text search index on full_content
CREATE INDEX cvs_full_content_fts_idx ON cvs USING gin(to_tsvector('english', full_content));

-- Add index on industries array
CREATE INDEX cvs_industries_idx ON cvs USING gin(industries);

-- Add index on skills array
CREATE INDEX cvs_skills_idx ON cvs USING gin(skills);
