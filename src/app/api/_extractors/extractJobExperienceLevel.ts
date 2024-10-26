import { sendGPTRequest } from "../_utils/openAI";
import { ExperienceLevel } from "@/types/Enums";
import { EXTRACT_JOB_EXPERIENCE_LEVEL_PROMPT } from "../_utils/prompts";

const ExperienceLevelMapping: Record<ExperienceLevel, string[]> = {
  junior: ["junior", "entry level", "entry-level", "beginner", "trainee"],
  mid: ["mid", "mid level", "mid-level", "intermediate", "experienced"],
  senior: ["senior", "expert", "lead", "principal", "staff"],
};

export const extractJobExperienceLevel = async (
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

  try {
    const gptResponse: {
      experienceLevel: ExperienceLevel;
    } = await sendGPTRequest({
      userRequest: `Job Description: ${detailedDescription}`,
      systemPrompt: EXTRACT_JOB_EXPERIENCE_LEVEL_PROMPT,
      model: "gpt-4o-mini",
    });

    const extractedLevel = gptResponse.experienceLevel.toLowerCase();

    if (
      Object.values(ExperienceLevel).includes(extractedLevel as ExperienceLevel)
    ) {
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
