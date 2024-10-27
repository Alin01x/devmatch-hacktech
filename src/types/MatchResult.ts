import { CV } from "./CV";
import { JobDescription } from "./JobDescription";
export type MatchingCV = {
  cv: CV;

  // Industry criteria
  industryScore: number;
  industryReasoning: string;

  // Technical Skills criteria
  technicalScore: number;
  technicalReasoning: string;
  technicalSkillsMatched: string[];
  technicalSkillsMissing: string[];
  technicalDetailedScoring: {
    [skill: string]: { present: boolean; weight: number; contribution: number };
  };

  // Overall criteria
  overallScore: number;
  overallAnalysis: {
    aiScore: number;
    // aiReasoning: string;
  };

  // Final score and best match reasoning
  finalScore: number;
  bestMatchReasoning: string;
};

export type MatchingJob = {
  jobDescription: JobDescription;

  // Industry criteria
  industryScore: number;
  industryReasoning: string;

  // Technical Skills criteria

  technicalScore: number;
  technicalReasoning: string;
  technicalSkillsMatched: string[];
  technicalSkillsMissing: string[];
  technicalDetailedScoring: {
    [skill: string]: { present: boolean; weight: number; contribution: number };
  };

  // Overall criteria
  overallScore: number;
  overallAnalysis: {
    aiScore: number;
  };

  // Final score and best match reasoning
  finalScore: number;
  bestMatchReasoning: string;
};
