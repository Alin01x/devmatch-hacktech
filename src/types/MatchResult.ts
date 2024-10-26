import { CV } from "./CV";
import { JobDescription } from "./JobDescription";

// Types for matching scores
export interface MatchScore {
  industryKnowledgeScore: number; // 0-100
  technicalSkillsScore: number; // 0-100
  jobDescriptionMatchScore: number; // 0-100
  finalScore: number; // 0-100
  matchExplanation: string; // Explanation of why this match was made
}

// Type for the matching result
export interface MatchResult {
  cv: CV;
  jobDescription: JobDescription;
  score: MatchScore;
}
