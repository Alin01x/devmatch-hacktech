import { CV } from "@/types/CV";
import { JobDescription, Skills } from "@/types/JobDescription";
import natural from "natural";
import stringSimilarity from "string-similarity";

interface Scores {
  industry: number;
  skills: number;
  text: number;
  final: number;
}

interface ScoredCV {
  cv: CV;
  scores: Scores;
}

const tfidf = new natural.TfIdf();
const tokenizer = new natural.WordTokenizer();

/**
 * Quick initial match based on skills overlap
 */
function getInitialMatches(jobDescription: JobDescription, cvs: CV[]): CV[] {
  // Extract required skills from job description
  const requiredSkills = new Set(Object.keys(jobDescription.skills));

  // Filter CVs that have at least one matching skill
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
 * Calculate text similarity between job description and CV
 */
function calculateTextSimilarity(
  jobDescription: string,
  cvContent: string
): number {
  // Clean and prepare texts
  const cleanJobDesc = jobDescription.toLowerCase().trim();
  const cleanCVContent = cvContent.toLowerCase().trim();

  // Add documents to TF-IDF
  tfidf.addDocument(cleanJobDesc);
  tfidf.addDocument(cleanCVContent);

  // Get terms from job description
  const jobTerms = tokenizer.tokenize(cleanJobDesc);

  // Calculate TF-IDF similarity
  let totalSimilarity = 0;
  jobTerms.forEach((term) => {
    const scores = tfidf.tfidfs(term);
    if (scores[1] > 0) {
      // If term exists in CV
      totalSimilarity += 1;
    }
  });

  // Calculate cosine similarity
  const cosineSimilarity =
    stringSimilarity.compareTwoStrings(cleanJobDesc, cleanCVContent) * 100;

  // Combine scores (weighted average)
  const tfidfScore = (totalSimilarity / jobTerms.length) * 100;
  return tfidfScore * 0.6 + cosineSimilarity * 0.4;
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
  const textScore = calculateTextSimilarity(
    jobDescription.detailed_description,
    cv.full_content
  );

  // Calculate final weighted score
  const finalScore = industryScore * 0.1 + skillsScore * 0.3 + textScore * 0.6;

  return {
    cv,
    scores: {
      industry: industryScore,
      skills: skillsScore,
      text: textScore,
      final: finalScore,
    },
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
