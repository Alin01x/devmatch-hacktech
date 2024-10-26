import { headers } from "../_utils/requestHeaders";
import { JobDescription, Skills } from "../../../types/JobDescription";
import { supabase } from "@/lib/supabase";
import { SKILLS } from "@/constants/skills";
import { CV } from "@/types/CV";
import { industryAnalysisService } from "../_services/IndustryAnalysisService";
import { MatchingCV } from "@/types/MatchResult";
import { log } from "console";

export async function POST(request: Request) {
  try {
    const { job_title, industry, detailed_description, skills } =
      (await request.json()) as Omit<JobDescription, "id" | "createdAt">;

    // TODO: implement data validation

    return handleJobMatching(job_title, industry, detailed_description, skills);
  } catch (e) {
    console.error("Error processing job description:", e);
    return new Response(
      JSON.stringify({ error: "Failed to process Job Description." }),
      {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      }
    );
  }
}

const getSkillWithProperCase = (skill: string) => {
  // Read all skills from SKILLS constant I have
  // If a skill is found in the SKILLS constant, return the skill with proper case

  const skillWithProperCase = SKILLS.find(
    (s) => s.toLowerCase() === skill.toLowerCase()
  );
  return skillWithProperCase || skill;
};

export const handleJobMatching = async (
  job_title: string,
  industry: string,
  detailed_description: string,
  skills: Skills
) => {
  // Fix letter casing for skills
  for (const key in skills) {
    const weight = skills[key];
    delete skills[key];
    skills[getSkillWithProperCase(key)] = weight;
  }

  // Store Job Descriptions in the database
  const jobDescriptionData = {
    detailed_description: detailed_description,
    job_title: job_title,
    industry,
    skills,
  };

  const { data, error: insertError } = await supabase
    .from("job_descriptions")
    .insert(jobDescriptionData)
    .select()
    .single();
  if (insertError) throw insertError;

  // MATCHING ALGORITHM

  // Step 1: Read all CVs with at least 1 skill match
  const { data: potentialCVs, error: readError } = await supabase
    .from("cvs")
    .select("*")
    .overlaps("skills", Object.keys(skills));
  if (readError) throw readError;

  console.log("Step 1: Potential", potentialCVs.length);

  // Step 2: Industry Knowledge Criteria (10%)
  // Perform semantic analysis on each CV

  const matchingCVs: MatchingCV[] = [];

  for (const cv of potentialCVs) {
    const { score, reasoning } =
      industryAnalysisService.analyzeIndustryRelevance(cv, industry);

    matchingCVs.push({
      cv,
      industryScore: score,
      industryReasoning: reasoning,
    });
  }


  console.log("Step 2: Matching CVs", matchingCVs);

  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { ...headers, "Content-Type": "application/json" },
  });
};
