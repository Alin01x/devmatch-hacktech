export const EXTRACT_JOB_EXPERIENCE_LEVEL_PROMPT = `
    You are an AI assistant that analyzes job descriptions and determines the experience level required.
    Output must be JSON in the following format:
    {
        "experienceLevel": "junior" | "mid" | "senior"
    }
`;

export const EXTRACT_CV_DATA_PROMPT = `
    You are an AI assistant that extracts data from a CV.
    Output must be JSON in the following format:
    {
        "experienceLevel": "junior" | "mid" | "senior",
        "skills": ["skill1", "skill2", "skill3"],
        "industries": ["industry1", "industry2", "industry3"]
    }

    Example:
    {
        "experienceLevel": "mid",
        "skills": ["React", "Python", "SQL", "Machine Learning", "Data Visualization"],
        "industries": ["Finance", "Healthcare"]
    }
`;
