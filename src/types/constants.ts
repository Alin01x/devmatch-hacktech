import { ExperienceLevel } from './Enums';
import { JobDescription } from './JobDescription';
import { MatchResult } from './MatchResult';

// Sample CV and JobDescription objects (you'll need to replace these with actual data)
export interface CVMatch extends Omit<MatchResult, 'cv' | 'jobDescription'> {
    experienceLevel: ExperienceLevel,
    name: string
}

export const MATCH_RESULT_SAMPLES: CVMatch[] = [
    {
    name: "Jane Smith",
    experienceLevel: ExperienceLevel.Senior,
    score: {
        industryKnowledgeScore: 98,
        technicalSkillsScore: 96,
        jobDescriptionMatchScore: 95,
        finalScore: 96,
        matchExplanation: "Exceptional match across all areas. This candidate is an excellent fit for the position."
    }
    },
  {
    name: "John Doe",
    experienceLevel: ExperienceLevel.Mid, 
    score: {
      industryKnowledgeScore: 85,
      technicalSkillsScore: 92,
      jobDescriptionMatchScore: 88,
      finalScore: 90,
      matchExplanation: "Strong technical skills and industry knowledge with excellent job description match."
    }
  },
  {
    name: "Jane Smith",
    experienceLevel: ExperienceLevel.Mid,
    score: {
      industryKnowledgeScore: 70,
      technicalSkillsScore: 80,
      jobDescriptionMatchScore: 75,
      finalScore: 76,
      matchExplanation: "Good technical skills but could improve industry knowledge for a better match."
    }
  },
  {
    name: "Jane Smith",
    experienceLevel: ExperienceLevel.Junior,
    score: {
      industryKnowledgeScore: 95,
      technicalSkillsScore: 65,
      jobDescriptionMatchScore: 80,
      finalScore: 78,
      matchExplanation: "Excellent industry knowledge, but technical skills could be improved to better match the job requirements."
    }
  },
  {
    name: "Jane Smith",
    experienceLevel: ExperienceLevel.Mid,
    score: {
      industryKnowledgeScore: 60,
      technicalSkillsScore: 55,
      jobDescriptionMatchScore: 50,
      finalScore: 54,
      matchExplanation: "Moderate match across all areas. Significant improvement needed in all aspects for a better fit."
    }
  },
];

export interface JobMatch extends Omit<JobDescription, 'skills'> {
    skills: string[]
}

export const SAMPLE_JOB_MATCH: JobMatch = {
    id: "1",
    jobTitle: "Senior Full Stack Developer",
    experienceLevel: ExperienceLevel.Senior,
    industry: "Information Technology",
    detailedDescription: `We are seeking a Senior Full Stack Developer to join our dynamic team. The ideal candidate will have:
  
  - 5+ years of experience in full stack development
  - Proficiency in React, Node.js, and TypeScript
  - Experience with cloud platforms (preferably AWS)
  - Strong problem-solving skills and attention to detail
  - Excellent communication and teamwork abilities
  
  Responsibilities include:
  - Developing and maintaining web applications
  - Collaborating with cross-functional teams
  - Mentoring junior developers
  - Participating in code reviews and architectural decisions`,
    skills: ["React", 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
    createdAt: new Date("2023-04-01")
  };