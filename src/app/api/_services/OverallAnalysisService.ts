import { CV } from "@/types/CV";
import { JobDescription } from "@/types/JobDescription";
import { sendGPTRequest } from "../_utils/openAI";
import { MATCH_CV_TO_JOB_PROMPT } from "../_utils/prompts";

export class OverallAnalysisService {
  public async analyzeMatch(
    cv: CV,
    jobDescription: JobDescription
  ): Promise<{
    score: number;
    reasoning: string;
  }> {
    return await this.performAIAnalysis(cv, jobDescription);
  }

  private async performAIAnalysis(
    cv: CV,
    jobDescription: JobDescription
  ): Promise<{ score: number; reasoning: string }> {
    const userMessage = `
Job Description:
- Title: ${jobDescription.job_title}
- Industry: ${jobDescription.industry}
- Description: ${jobDescription.detailed_description}
- Required Skills and percentage importance: ${Object.keys(
      jobDescription.skills
    )
      .map((skill) => {
        return `${skill} - ${jobDescription.skills[skill]}%`;
      })
      .join(";")}


CV Content:
${cv.full_content}
`;

    const response = await sendGPTRequest({
      systemPrompt: MATCH_CV_TO_JOB_PROMPT,
      userRequest: userMessage,
      temperature: 0.3, // Lower temperature for more consistent scoring
    });

    return {
      score: response.score,
      reasoning: response.reasoning,
    };
  }
}
