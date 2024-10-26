import { sendGPTRequest } from "../_utils/openAI";
import { EXTRACT_CV_DATA_PROMPT } from "../_utils/prompts";

// TODO:  handle case for which GPT couldn't extract all the data

export const extractCvData = async (
  content: string
): Promise<{
  name: string;
  skills: string[];
  industries: string[];
}> => {
  try {
    const gptResponse: {
      name: string;
      skills: string[];
      industries: string[];
    } = await sendGPTRequest({
      userRequest: `CV: ${content}`,
      systemPrompt: EXTRACT_CV_DATA_PROMPT,
    });

    return {
      name: gptResponse.name ?? "",
      skills: gptResponse.skills ?? [],
      industries: gptResponse.industries ?? [],
    };
  } catch (error) {
    console.error("Error extracting experience level:", error);
    return {
      name: "",
      skills: [],
      industries: [],
    };
  }
};
