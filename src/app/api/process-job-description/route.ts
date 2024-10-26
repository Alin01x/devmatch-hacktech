import { headers } from "../_utils/requestHeaders";
import { JobDescription } from "../../../types/JobDescription";
import { extractExperienceLevel } from "./extractors/extractExperienceLevel";

export async function POST(request: Request) {
  const { jobTitle, industry, detailedDescription, skills } =
    (await request.json()) as Omit<
      JobDescription,
      "id" | "createdAt" | "experienceLevel"
    >;

  // TODO: implement data validation using zod

  // Step 1: Strip the Experience Level from the Job Title (if any)
  //   const strippedJobTitle = jobTitle.replace(/^(junior|mid|senior)\s/i, "");

  // Step 2: From the Job Title Field and detailed description extract the experience level
  const experienceLevel = await extractExperienceLevel(
    jobTitle,
    detailedDescription
  );

  // Step 2: From the Job Title Field and detailed description extract the experience level

  // Step 3: From the detailed description extract the skills

  return new Response("Hello, Next.js!", {
    status: 200,
    headers: headers,
  });
}
