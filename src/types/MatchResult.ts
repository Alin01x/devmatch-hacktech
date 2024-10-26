import { CV } from "./CV";
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

  // Overall criteria (basically our beloved GPT + a bit of NLP so we don't give him full power yet)
  overallScore: number;
  overallAnalysis: {
    aiScore: number;
    aiReasoning: string;
  };

  // Final score and best match reasoning
  finalScore: number;
  bestMatchReasoning: string;
};
