import { headers } from "../_utils/requestHeaders";
import { JobDescription, Skills } from "../../../types/JobDescription";
import { supabase } from "@/lib/supabase";
import { SKILLS } from "@/constants/skills";

import { IndustryAnalysisService } from "../_services/IndustryAnalysisService";
import { MatchingCV } from "@/types/MatchResult";

import { SkillAnalysisService } from "../_services/SkillAnalysisService";
import { OverallAnalysisService } from "../_services/OverallAnalysisService";
import { getFinalMatchingScore } from "../_utils/getFinalMatchingScore";
import { sendGPTRequest } from "../_utils/openAI";
import { BEST_MATCH_REASONING_PROMPT } from "../_utils/prompts";

export async function POST(request: Request) {
  try {
    const { job_title, industry, detailed_description, skills } =
      (await request.json()) as Omit<JobDescription, "id" | "createdAt">;

    if (!job_title || !industry || !detailed_description || !skills) {
      return new Response(JSON.stringify({ error: "Missing data." }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

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

  const { data: jobDescription, error: insertError } = await supabase
    .from("job_descriptions")
    .insert(jobDescriptionData)
    .select()
    .single();
  if (insertError) throw insertError;

  // 🚀🚀🚀
  // If you've made it here, thanks for reading my code. This is why you're here for!
  // THE MATCHING ALGORITHM! 🎉

  // Read all CVs with at least 1 skill overlap
  // Otherwise what's the point? I know we're devs and supposed to learn new tech but still!!!
  const { data: potentialCVs, error: readError } = await supabase
    .from("cvs")
    .select("*")
    .overlaps("skills", Object.keys(skills));
  if (readError) throw readError;

  let matchingCVs: MatchingCV[] = [];

  // Initialize services
  const industryAnalysisService = new IndustryAnalysisService();
  const overallAnalysisService = new OverallAnalysisService();

  for (const cv of potentialCVs) {
    // Industry Knowledge Criteria
    // Perform related industries overlap and semantic analysis on each CV
    const { score: industryScore, reasoning: industryReasoning } =
      industryAnalysisService.analyzeIndustryRelevance(cv, industry);

    // Technical Skills Criteria
    // Perform direct overlap verification and score calculation by each skill's weight
    const technicalAnalysis = SkillAnalysisService.analyzeTechnicalSkills(
      cv,
      skills
    );

    matchingCVs.push({
      cv,
      industryScore,
      industryReasoning,
      technicalScore: technicalAnalysis.score,
      technicalReasoning: technicalAnalysis.reasoning,
      technicalSkillsMatched: technicalAnalysis.matchedSkills,
      technicalSkillsMissing: technicalAnalysis.missingSkills,
      technicalDetailedScoring: technicalAnalysis.detailedScoring,
      overallScore: 0,
      overallAnalysis: {
        aiScore: 0,
        aiReasoning: "",
      },
      finalScore: 0,
      bestMatchReasoning: "",
    });
  }

  // Sort CVs by combined weighted score (technical score is 3x more important)
  // In the final score industry is 10% and technical is 30%
  // So here we scale them to 25% and 75% respectively
  matchingCVs.sort((a, b) => {
    const weightedScoreA = a.technicalScore * 3 + a.industryScore;
    const weightedScoreB = b.technicalScore * 3 + b.industryScore;
    return weightedScoreB - weightedScoreA;
  });

  // Let's narrow down by only analyzing further the top 10 CVs
  matchingCVs = matchingCVs.slice(0, 10);

  matchingCVs = await Promise.all(
    matchingCVs.map(async (matchingCV) => {
      // Get overall analysis (OpenAI)
      const overallAnalysis = await overallAnalysisService.analyzeMatch(
        matchingCV.cv,
        jobDescription
      );

      return {
        ...matchingCV,
        overallScore: overallAnalysis.score,
        overallAnalysis: {
          aiScore: overallAnalysis.score / 100,
          aiReasoning: overallAnalysis.reasoning,
        },
        finalScore: 0,
        bestMatchReasoning: "",
      };
    })
  );

  // Calculate final score
  // Industry Knowledge Criteria (10%)
  // Technical Skills Criteria (30%)
  // Job Description and CV Matching (60%)

  matchingCVs.forEach((cv) => {
    cv.finalScore = getFinalMatchingScore(
      cv.industryScore,
      cv.technicalScore,
      cv.overallScore
    );
  });

  // Sort by final score
  matchingCVs.sort((a, b) => b.finalScore - a.finalScore);

  // Keep the best 5 CVs
  matchingCVs = matchingCVs.slice(0, 5);

  // Get best match reasoning
  const bestMatchReasoning = await sendGPTRequest({
    systemPrompt: BEST_MATCH_REASONING_PROMPT,
    userRequest: matchingCVs[0].cv.full_content,
  });

  matchingCVs[0].bestMatchReasoning = bestMatchReasoning;

  // Ensure all scores have no decimals
  matchingCVs.forEach((cv) => {
    cv.industryScore = Math.round(cv.industryScore);
    cv.technicalScore = Math.round(cv.technicalScore);
    cv.overallScore = Math.round(cv.overallScore);
    cv.finalScore = Math.round(cv.finalScore);
  });

  return new Response(JSON.stringify({ success: true, data: matchingCVs }), {
    status: 200,
    headers: { ...headers, "Content-Type": "application/json" },
  });
};
