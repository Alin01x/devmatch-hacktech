import { ExperienceLevel } from "@/types/JobDescription";
import { sendGPTRequest } from "../../_utils/openai";

const ExperienceLevelMapping: Record<ExperienceLevel, string[]> = {
  junior: ["junior", "entry level", "entry-level", "beginner", "trainee"],
  mid: ["mid", "mid level", "mid-level", "intermediate", "experienced"],
  senior: ["senior", "expert", "lead", "principal", "staff"],
};

export const extractExperienceLevel = async (
  jobTitle: string,
  detailedDescription: string
): Promise<ExperienceLevel> => {
  // Extract the experience level from the job title
  // by checking if it matches any of the keys in the ExperienceLevelMapping
  const experienceLevel = Object.keys(ExperienceLevelMapping).find((level) =>
    ExperienceLevelMapping[level as ExperienceLevel].some((keyword) =>
      jobTitle.toLowerCase().includes(keyword)
    )
  ) as ExperienceLevel | undefined;

  if (experienceLevel) return experienceLevel;

  // Fallback - If no experience level is found in the job title
  // Extract the experience level from the detailed description using GPT
  const systemPrompt =
    "You are an AI assistant that analyzes job descriptions and determines the experience level required.";
  const userRequest = `Based on the following job description, determine the experience level required. Respond with only one of these options: junior, mid, or senior.\n\nJob Description: ${detailedDescription}`;

  try {
    const gptResponse = await sendGPTRequest({
      userRequest,
      systemPrompt,
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      maxTokens: 10,
    });

    const extractedLevel = gptResponse.trim().toLowerCase();
    if (["junior", "mid", "senior"].includes(extractedLevel)) {
      return extractedLevel as ExperienceLevel;
    }
  } catch (error) {
    console.error("Error extracting experience level:", error);
  }

  // Default fallback if GPT fails or returns an invalid response
  // TODO:  can be handled by having an "unknown" experience level
  //        for which we ask the user to manually set the experience level in the UI
  return "mid" as ExperienceLevel;
};
