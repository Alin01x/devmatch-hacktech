import { headers } from "../_utils/requestHeaders";
import { extractCvData } from "../_extractors/extractCvData";
import { supabase } from "@/lib/supabase";
import { MatchingJob } from "@/types/MatchResult";
import { IndustryAnalysisService } from "../_services/IndustryAnalysisService";
import { OverallAnalysisService } from "../_services/OverallAnalysisService";
import { SkillAnalysisService } from "../_services/SkillAnalysisService";
import { getFinalMatchingScore } from "../_utils/getFinalMatchingScore";
import { sendGPTRequest } from "../_utils/openAI";
import { BEST_MATCH_JOB_REASONING_PROMPT } from "../_utils/prompts";

export async function POST(request: Request) {
  try {
    const { fullContent } = (await request.json()) as { fullContent: string };

    if (!fullContent) {
      return new Response(JSON.stringify({ error: "Missing CV's content." }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    return handleCvMatching(fullContent);
  } catch (e) {
    console.error("Error processing CV:", e);
    return new Response(JSON.stringify({ error: "Failed to process CV." }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}

export const handleCvMatching = async (fullContent: string) => {
  const extractedFields: {
    name: string;
    skills: string[];
    industries: string[];
  } = await extractCvData(fullContent);

  // Store CV in the database
  const profileData = {
    name: extractedFields.name,
    skills: extractedFields.skills,
    industries: extractedFields.industries,
    full_content: fullContent,
  };

  const { data: cv, error: insertError } = await supabase
    .from("cvs")
    .insert(profileData)
    .select()
    .single();
  if (insertError) throw insertError;

  // Read all Job Descriptions with at least 1 skill overlap
  const { data: potentialJobs, error: readError } = await supabase
    .from("job_descriptions")
    .select("*")
    .overlaps("listed_skills", extractedFields.skills);
  if (readError) throw readError;

  // Filter out duplicate job descriptions based on job title and detailed description
  const uniquePotentialJobs = potentialJobs.filter(
    (job, index, self) =>
      index ===
      self.findIndex(
        (t) => t.job_title === job.job_title && t.detailed_description === job.detailed_description
      )
  );

  if (uniquePotentialJobs.length === 0) {
    return new Response(JSON.stringify({ success: true, data: null }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }

  let matchingJobs: MatchingJob[] = [];

  // Initialize services
  const industryAnalysisService = new IndustryAnalysisService();
  const overallAnalysisService = new OverallAnalysisService();

  // TODO: initialize the other one too?

  for (const job of uniquePotentialJobs) {
    // Industry Knowledge Criteria
    // Perform related industries overlap and semantic analysis on each CV
    const { score: industryScore, reasoning: industryReasoning } =
      industryAnalysisService.analyzeIndustryRelevance(cv, job.industry);

    // Technical Skills Criteria
    // Perform direct overlap verification and score calculation by each skill's weight
    const technicalAnalysis = SkillAnalysisService.analyzeTechnicalSkills(
      cv,
      job.skills
    );

    matchingJobs.push({
      jobDescription: job,
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
      },
      finalScore: 0,
      bestMatchReasoning: "",
    });
  }

  // Sort jobs by combined weighted score (technical score is 3x more important)
  // In the final score industry is 10% and technical is 30%
  // So here we scale them to 25% and 75% respectively
  matchingJobs.sort((a, b) => {
    const weightedScoreA = a.technicalScore * 3 + a.industryScore;
    const weightedScoreB = b.technicalScore * 3 + b.industryScore;
    return weightedScoreB - weightedScoreA;
  });

  // Let's narrow down by only analyzing further the top 5 jobs
  matchingJobs = matchingJobs.slice(0, 5);

  // Get overall analysis (OpenAI)
  matchingJobs = await Promise.all(
    matchingJobs.map(async (matchingJob) => {
      // Get overall analysis (OpenAI)
      const overallAnalysis = await overallAnalysisService.analyzeMatch(
        cv,
        matchingJob.jobDescription
      );

      return {
        ...matchingJob,
        overallScore: overallAnalysis.score,
        overallAnalysis: {
          aiScore: overallAnalysis.score,
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

  matchingJobs.forEach((job) => {
    job.finalScore = getFinalMatchingScore(
      job.industryScore,
      job.technicalScore,
      job.overallScore
    );
  });

  // Sort by final score
  matchingJobs.sort((a, b) => b.finalScore - a.finalScore);

  // Keep the best 5 CVs
  matchingJobs = matchingJobs.slice(0, 5);

  // Get best match reasoning
  const bestMatchReasoning = await sendGPTRequest({
    systemPrompt: BEST_MATCH_JOB_REASONING_PROMPT,
    userRequest: matchingJobs[0].jobDescription.detailed_description,
  });

  matchingJobs[0].bestMatchReasoning = bestMatchReasoning.reasoning;

  // Ensure all scores have no decimals

  const bestMatchingJob = {
    ...matchingJobs[0],
    industryScore: Math.round(matchingJobs[0].industryScore),
    technicalScore: Math.round(matchingJobs[0].technicalScore),
    overallScore: Math.round(matchingJobs[0].overallScore),
    finalScore: Math.round(matchingJobs[0].finalScore),
  };

  // Find Matching Job Descriptions
  return new Response(
    JSON.stringify({ success: true, data: bestMatchingJob }),
    {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    }
  );
};
