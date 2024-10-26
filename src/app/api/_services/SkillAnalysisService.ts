import { CV } from "@/types/CV";
import { Skills } from "@/types/JobDescription";

// Technical skills matching service
export class SkillAnalysisService {
  /**
   * Analyzes technical skills match between CV and job requirements
   * @param cv CV to analyze
   * @param requiredSkills Skills required for the job with their weights
   * @returns Object containing score and detailed analysis
   */
  static analyzeTechnicalSkills(cv: CV, requiredSkills: Skills) {
    const analysis = {
      score: 0,
      matchedSkills: [] as string[],
      missingSkills: [] as string[],
      detailedScoring: {} as {
        [skill: string]: {
          present: boolean;
          weight: number;
          contribution: number;
        };
      },
      reasoning: "",
    };

    // Normalize weights to ensure they sum to 100%
    const totalWeight = Object.values(requiredSkills).reduce(
      (sum, weight) => sum + weight,
      0
    );
    const normalizedSkills: Skills = {};
    Object.entries(requiredSkills).forEach(([skill, weight]) => {
      normalizedSkills[skill] = (weight / totalWeight) * 100;
    });

    // Calculate score for each skill
    let totalScore = 0;
    Object.entries(normalizedSkills).forEach(([skill, weight]) => {
      const isPresent = cv.skills.includes(skill);
      const scoreContribution = isPresent ? weight : 0;

      analysis.detailedScoring[skill] = {
        present: isPresent,
        weight: weight,
        contribution: scoreContribution,
      };

      if (isPresent) {
        analysis.matchedSkills.push(skill);
        totalScore += scoreContribution;
      } else {
        analysis.missingSkills.push(skill);
      }
    });

    // Normalize final score to be between 0 and 1
    analysis.score = totalScore / 100;
    analysis.reasoning = this.generateReasoning(analysis);

    return analysis;
  }

  /**
   * Generates detailed reasoning for the technical skills analysis
   */
  private static generateReasoning(analysis: {
    matchedSkills: string[];
    missingSkills: string[];
    detailedScoring: {
      [skill: string]: {
        present: boolean;
        weight: number;
        contribution: number;
      };
    };
  }): string {
    const matchedSkillsText =
      analysis.matchedSkills.length > 0
        ? `Matched skills (${
            analysis.matchedSkills.length
          }): ${analysis.matchedSkills.join(", ")}`
        : "No matching skills found";

    const missingSkillsText =
      analysis.missingSkills.length > 0
        ? `Missing skills (${
            analysis.missingSkills.length
          }): ${analysis.missingSkills.join(", ")}`
        : "No missing skills";

    const detailedScoring = Object.entries(analysis.detailedScoring)
      .map(
        ([skill, details]) =>
          `${skill}: ${
            details.present ? "Present" : "Missing"
          } (Weight: ${details.weight.toFixed(
            1
          )}%, Contribution: ${details.contribution.toFixed(1)}%)`
      )
      .join("\n");

    return `
  Technical Skills Analysis:
  ${matchedSkillsText}
  ${missingSkillsText}
  
  Detailed Scoring:
  ${detailedScoring}
      `.trim();
  }
}
