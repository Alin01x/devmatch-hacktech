import { headers } from "../_utils/requestHeaders";
import { JobDescription } from "../../../types/JobDescription";
import { supabase } from "@/lib/supabase";
import { findTopMatches } from "../_utils/semanticAnalysis";
import { ExperienceLevel } from "@/types/Enums";
import { SKILLS } from "@/constants/skills";

export async function POST(request: Request) {
  try {
    const { job_title, industry, detailed_description, skills } =
      (await request.json()) as Omit<JobDescription, "id" | "createdAt">;

    for (const key in skills) {
      const weight = skills[key];
      delete skills[key];
      skills[getSkillWithProperCase(key)] = weight;
    }

    // TODO: implement data validation

    // Store Job Descriptions in the database
    const jobDescriptionData = {
      detailed_description: detailed_description,
      job_title: job_title,
      industry,
      skills,
    };

    const { data, error } = await supabase
      .from("job_descriptions")
      .insert(jobDescriptionData)
      .select()
      .single();

    if (error) {
      console.error("Error saving job description:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save Job Description." }),
        {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }

    // Find Matching CV

    // Read all CVs from the database with at least 1 skill match
    const { data: cvs, error: cvError } = await supabase
      .from("cvs")
      .select("*")
      .overlaps("skills", Object.keys(skills));

    if (cvError) {
      console.error("Error fetching CVs:", cvError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch matching CVs." }),
        {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
    }

    console.log("CVs with at least one skill", cvs.length);

    // Semantic Analysis
    const topMatches = findTopMatches(data, cvs);

    console.log("Top Matches:", topMatches);
    // Find all CVs having at least 50% match with the job description
    // const matchingCVs = await findMatchingCVs(jobDescriptionData);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
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
