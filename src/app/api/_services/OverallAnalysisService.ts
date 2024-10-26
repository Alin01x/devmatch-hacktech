import { CV } from "@/types/CV";
import { JobDescription } from "@/types/JobDescription";
import natural, { TfIdf } from "natural";
import { sendGPTRequest } from "../_utils/openAI";
import { MATCH_CV_TO_JOB_PROMPT } from "../_utils/prompts";

export class OverallAnalysisService {
  private tokenizer: natural.WordTokenizer;
  private tfidf: TfIdf;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new TfIdf();
  }

  public async analyzeMatch(
    cv: CV,
    jobDescription: JobDescription
  ): Promise<{
    score: number;
    aiScore: number;
    aiReasoning: string;
    naturalLanguageScore: number;
    naturalLanguageReasoning: string;
  }> {
    // Perform OpenAI analysis (80% weight)
    const aiAnalysis = await this.performAIAnalysis(cv, jobDescription);

    // Perform natural language analysis (20% weight)
    const nlpAnalysis = this.performNLPAnalysis(cv, jobDescription);

    // Calculate final weighted score
    const finalScore = aiAnalysis.score * 0.8 + nlpAnalysis.score * 0.2;

    return {
      score: finalScore,
      aiScore: aiAnalysis.score,
      aiReasoning: aiAnalysis.reasoning,
      naturalLanguageScore: nlpAnalysis.score,
      naturalLanguageReasoning: nlpAnalysis.reasoning,
    };
  }

  private async performAIAnalysis(
    cv: CV,
    jobDescription: JobDescription
  ): Promise<{ score: number; reasoning: string }> {
    
    const userMessage = `
Job Description:
- Title: ${jobDescription.job_title}
- Industry: ${jobDescription.industry}
- Description: ${jobDescription.detailed_description}
- Required Skills and percentage importance: ${Object.keys(
      jobDescription.skills
    )
      .map((skill) => {
        return `${skill} - ${jobDescription.skills[skill]}%`;
      })
      .join(";")}


CV Content:
${cv.full_content}
`;

    const response = await sendGPTRequest({
      systemPrompt: MATCH_CV_TO_JOB_PROMPT,
      userRequest: userMessage,
      temperature: 0.4, // Lower temperature for more consistent scoring
    });

    return {
      score: response.score,
      reasoning: response.reasoning,
    };
  }

  private performNLPAnalysis(
    cv: CV,
    jobDescription: JobDescription
  ): { score: number; reasoning: string } {
    // Prepare documents for TF-IDF analysis
    this.tfidf.addDocument(jobDescription.detailed_description);
    this.tfidf.addDocument(cv.full_content);

    // Get important terms from job description
    const jobTerms = this.tokenizer
      .tokenize(jobDescription.detailed_description.toLowerCase())
      .filter((term) => term.length > 3);

    // Calculate similarity score based on term frequency-inverse document frequency
    let totalSimilarity = 0;
    let matchedTerms: { term: string; score: number }[] = [];
    let missingTerms: { term: string; score: number }[] = [];

    jobTerms.forEach((term) => {
      const jobDescriptionScore = this.tfidf.tfidf(term, 0);
      const cvScore = this.tfidf.tfidf(term, 1);

      const similarity = Math.min(cvScore / (jobDescriptionScore || 1), 1);
      totalSimilarity += similarity;

      if (similarity > 0.5) {
        matchedTerms.push({ term, score: similarity });
      } else {
        missingTerms.push({ term, score: similarity });
      }
    });

    // Sort matched and missing terms by score
    matchedTerms.sort((a, b) => b.score - a.score);
    missingTerms.sort((a, b) => a.score - b.score);

    // Normalize score to 0-100 range
    const normalizedScore = (totalSimilarity / jobTerms.length) * 100;

    // Generate reasoning based on matched and missing terms
    const reasoning = `
Natural language analysis found ${matchedTerms.length} relevant matches:
- Strong matches: ${matchedTerms.slice(0, 5).map(t => t.term).join(", ")}
- Key missing terms: ${missingTerms.slice(0, 5).map(t => t.term).join(", ")}
- Overall semantic similarity: ${normalizedScore.toFixed(1)}%`;

    return {
      score: normalizedScore,
      reasoning: reasoning.trim(),
    };
  }
}
