import winkNLP from "wink-nlp";
import model = require("wink-eng-lite-model");
import its = require("wink-nlp/src/its.js");

import { CV } from "@/types/CV";
import { JobDescription, Skills } from "@/types/JobDescription";

// Initialize winkNLP
const nlp = winkNLP(model);

interface Scores {
  industry: number;
  skills: number;
  text: number;
  final: number;
}

interface ScoredCV {
  cv: CV;
  scores: Scores;
  matchedTerms?: string[]; // For debugging/explanation
}

/**
 * Quick initial match based on skills overlap
 */
function getInitialMatches(jobDescription: JobDescription, cvs: CV[]): CV[] {
  const requiredSkills = new Set(Object.keys(jobDescription.skills));

  const initialMatches = cvs.filter((cv) => {
    const cvSkills = new Set(cv.skills);
    const matchingSkills = [...requiredSkills].filter((skill) =>
      cvSkills.has(skill)
    );
    return matchingSkills.length > 0;
  });

  console.log(`Initial matches based on skills: ${initialMatches.length}`);
  return initialMatches;
}

/**
 * Calculate technical skills match score
 */
function calculateSkillsScore(jobSkills: Skills, cvSkills: string[]): number {
  const requiredSkills = Object.entries(jobSkills);
  let totalWeight = 0;
  let matchedWeight = 0;

  requiredSkills.forEach(([skill, weight]) => {
    totalWeight += weight;
    if (cvSkills.includes(skill)) {
      matchedWeight += weight;
    }
  });

  return (matchedWeight / totalWeight) * 100;
}

/**
 * Calculate text similarity using Wink NLP
 */
function calculateTextSimilarity(
  jobDescription: string,
  cvContent: string
): {
  score: number;
  matchedTerms: string[];
} {
  // Process both documents
  const jobDoc = nlp.readDoc(jobDescription);
  const cvDoc = nlp.readDoc(cvContent);

  // Extract key elements from both documents
  const getKeyElements = (doc: any) => {
    const tokens = new Set(doc.tokens().out());
    const entities = new Set(doc.entities().out());
    const concepts = new Set(
      doc
        .tokens()
        .filter((t: any) => t.out(its.type) === "CONCEPT")
        .out()
    );

    return new Set([...tokens, ...entities, ...concepts]);
  };

  const jobElements = getKeyElements(jobDoc);
  const cvElements = getKeyElements(cvDoc);

  // Find matching elements
  const matchedTerms = [...jobElements].filter((element) =>
    cvElements.has(element)
  );

  // Calculate similarity score
  const similarityScore =
    ((matchedTerms.length * 2) / (jobElements.size + cvElements.size)) * 100;

  return {
    score: similarityScore,
    matchedTerms,
  };
}

/**
 * Calculate industry match score
 */
function calculateIndustryScore(
  jobIndustry: string,
  cvIndustries: string[]
): number {
  return cvIndustries.includes(jobIndustry) ? 100 : 0;
}

/**
 * Calculate detailed scores for a CV
 */
function calculateDetailedScores(
  jobDescription: JobDescription,
  cv: CV
): ScoredCV {
  // Calculate individual scores
  const industryScore = calculateIndustryScore(
    jobDescription.industry,
    cv.industries
  );
  const skillsScore = calculateSkillsScore(jobDescription.skills, cv.skills);
  const textAnalysis = calculateTextSimilarity(
    jobDescription.detailed_description,
    cv.full_content
  );

  // Calculate final weighted score
  const finalScore =
    industryScore * 0.1 + skillsScore * 0.3 + textAnalysis.score * 0.6;

  return {
    cv,
    scores: {
      industry: industryScore,
      skills: skillsScore,
      text: textAnalysis.score,
      final: finalScore,
    },
    matchedTerms: textAnalysis.matchedTerms,
  };
}

/**
 * Find top matching CVs
 */
function findTopMatches(
  jobDescription: JobDescription,
  cvs: CV[],
  limit: number = 5
): ScoredCV[] {
  try {
    // Step 1: Get initial matches based on basic criteria
    const initialMatches = getInitialMatches(jobDescription, cvs);

    // Step 2: Calculate detailed scores for remaining CVs
    const scoredMatches = initialMatches.map((cv) =>
      calculateDetailedScores(jobDescription, cv)
    );

    // Step 3: Sort by final score and get top matches
    return scoredMatches
      .sort((a, b) => b.scores.final - a.scores.final)
      .slice(0, limit);
  } catch (error) {
    console.error("Error in findTopMatches:", error);
    throw error;
  }
}

export {
  findTopMatches,
  calculateDetailedScores,
  calculateIndustryScore,
  calculateSkillsScore,
  calculateTextSimilarity,
  getInitialMatches,
};
