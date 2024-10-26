import { sendGPTRequest } from "../_utils/openAI";
import { ExperienceLevel } from "@/types/Enums";
import { EXTRACT_CV_DATA_PROMPT } from "../_utils/prompts";

export const extractCvData = async (
  content: string
): Promise<{
  industries: string[];
  skills: string[];
  experienceLevel: ExperienceLevel;
}> => {
  try {
    const gptResponse: {
      experienceLevel: ExperienceLevel;
      skills: string[];
      industries: string[];
    } = await sendGPTRequest({
      userRequest: `CV: ${content}`,
      systemPrompt: EXTRACT_CV_DATA_PROMPT,
    });

    // TODO:  handle case for which GPT couldn't extract all the data
    //        for which we can ask the user to manually set the fields in the UI

    return {
      experienceLevel: gptResponse.experienceLevel ?? "junior" as ExperienceLevel,
      skills: gptResponse.skills ?? [],
      industries: gptResponse.industries ?? [],
    };
  } catch (error) {
    console.error("Error extracting experience level:", error);
    return {
      experienceLevel: "junior" as ExperienceLevel,
      skills: [],
      industries: [],
    };
  }
};
