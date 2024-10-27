import { headers } from "../_utils/requestHeaders";
import { extractCvData } from "../_extractors/extractCvData";
import { supabase } from "@/lib/supabase";
import { MatchingJob } from "@/types/MatchResult";
import { IndustryAnalysisService } from "../_services/IndustryAnalysisService";
import { OverallAnalysisService } from "../_services/OverallAnalysisService";
import { SkillAnalysisService } from "../_services/SkillAnalysisService";
import { CV } from "@/types/CV";

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
    .overlaps("skills", extractedFields.skills);
  if (readError) throw readError;

  let matchingJobs: MatchingJob[] = [];

  // Initialize services
  const industryAnalysisService = new IndustryAnalysisService();
  const overallAnalysisService = new OverallAnalysisService();

  // TODO: initialize the other one too?

  for (const job of potentialJobs) {
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

  // Let's narrow down by only analyzing further the top 10 jobs
  matchingJobs = matchingJobs.slice(0, 10);

  const matchinbJobsWithoutJob = matchingJobs.map((matchingJob) => {
    return {
      industryScore: matchingJob.industryScore,
      technicalScore: matchingJob.technicalScore,
      technicalSkillsMatched: matchingJob.technicalSkillsMatched,
    };
  });
  console.log(matchinbJobsWithoutJob);
  // Get overall analysis (OpenAI)
  // matchingJobs = await Promise.all(
  //   matchingJobs.map(async (matchinbJob) => {
  //     // Get overall analysis (OpenAI)
  //     const overallAnalysis = await overallAnalysisService.analyzeMatch(
  //       cv,
  //       matchingJob.jobDescription.detailed_description
  //     );

  //     return {
  //       ...matchingCV,
  //       overallScore: overallAnalysis.score,
  //       overallAnalysis: {
  //         aiScore: overallAnalysis.score,
  //       },
  //       finalScore: 0,
  //       bestMatchReasoning: "",
  //     };
  //   })
  // );

  // // Calculate final score
  // // Industry Knowledge Criteria (10%)
  // // Technical Skills Criteria (30%)
  // // Job Description and CV Matching (60%)

  // matchingCVs.forEach((cv) => {
  //   cv.finalScore = getFinalMatchingScore(
  //     cv.industryScore,
  //     cv.technicalScore,
  //     cv.overallScore
  //   );
  // });

  // // Sort by final score
  // matchingCVs.sort((a, b) => b.finalScore - a.finalScore);

  // // Keep the best 5 CVs
  // matchingCVs = matchingCVs.slice(0, 5);

  // // Get best match reasoning
  // const bestMatchReasoning = await sendGPTRequest({
  //   systemPrompt: BEST_MATCH_REASONING_PROMPT,
  //   userRequest: matchingCVs[0].cv.full_content,
  // });

  // matchingCVs[0].bestMatchReasoning = bestMatchReasoning.reasoning;

  // // Ensure all scores have no decimals
  // matchingCVs.forEach((cv) => {
  //   cv.industryScore = Math.round(cv.industryScore);
  //   cv.technicalScore = Math.round(cv.technicalScore);
  //   cv.overallScore = Math.round(cv.overallScore);
  //   cv.finalScore = Math.round(cv.finalScore);
  // });

  // Find Matching Job Descriptions
  return new Response(
    JSON.stringify({ success: true, data: matchingJobs[0] }),
    {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    }
  );
};
