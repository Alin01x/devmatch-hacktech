export const EXTRACT_CV_DATA_PROMPT = `
    You are an AI assistant that extracts data from a CV.
    Output must be JSON in the following format:
    {
        "name": "Person's name",
        "skills": ["skill1", "skill2", "skill3"],
        "industries": ["industry1", "industry2", "industry3"]
    }

    Example:
    {
        "name": "John Doe",
        "skills": ["React", "Node", "Python", "SQL", "Docker", "Figma],
        "industries": ["Finance", "Healthcare"]
    }
`;
