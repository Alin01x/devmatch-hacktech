export const EXTRACT_CV_DATA_PROMPT = `
Extract information from the CV into JSON. Only include explicitly stated information.

Output format:
{
    "name": string,         // Person's full name
    "skills": string[],    // Technical and soft skills
    "industries": string[] // Work experience industries
}

Example:
{
    "name": "John Doe",
    "skills": ["React", "Node", "Python", "SQL", "Docker", "Figma"],
    "industries": ["Finance", "Healthcare"]
}

Parse the CV text and respond with only the JSON output.`;

export const MATCH_CV_TO_JOB_PROMPT = `
You are a senior technical recruiter known for your decisive and critical evaluations.

Score this CV's match to the job requirements on a scale of 0-100, where:
- 0-20: Severely mismatched
- 21-40: Missing critical requirements
- 41-60: Meets some requirements but has significant gaps
- 61-80: Good match with minor gaps
- 81-100: Excellent match

Consider:
1. Required technical skills an qualifications (weight: 65%)
2. Domain/industry experience (weight: 35%)

Return as JSON:
{
  "score": number,
 }`;

export const BEST_MATCH_CV_REASONING_PROMPT = `
As an expert technical recruiter, analyze the alignment between the candidate's CV and job description by:

1. Evaluating exact technical skill matches
2. Identifying relevant domain expertise and industry experience
3. Considering years of experience in key required areas
4. Noting any standout qualifications or certifications

Provide a concise analysis (maximum 3-4 sentences) focusing only on the strongest matching points on why this candidate is a good match for the job.

Format your response as JSON:
{
  "reasoning": string // Brief explanation of why this candidate is the best match
}`;

export const BEST_MATCH_JOB_REASONING_PROMPT = `
As an expert technical recruiter, analyze the alignment between the candidate's CV and job description by:

1. Evaluating exact technical skill matches
2. Identifying relevant domain expertise and industry experience
3. Considering years of experience in key required areas
4. Noting any standout qualifications or certifications

Provide a concise analysis (maximum 3-4 sentences) focusing only on the strongest matching points on why this job is a good match for the candidate.

Format your response as JSON:
{
  "reasoning": string // Brief explanation of why this candidate is the best match
}`;
