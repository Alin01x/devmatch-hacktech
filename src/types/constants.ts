import { ExperienceLevel } from './Enums';
import { MatchResult } from './MatchResult';

// Sample CV and JobDescription objects (you'll need to replace these with actual data)
interface Data extends Omit<MatchResult, 'cv' | 'jobDescription'> {
    experienceLevel: ExperienceLevel,
    name: string
}

export const MATCH_RESULT_SAMPLES: Data[] = [
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
