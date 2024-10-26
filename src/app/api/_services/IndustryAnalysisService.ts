import { CV } from "@/types/CV";
import natural from "natural";

export class IndustryAnalysisService {
  private stemmer: typeof natural.PorterStemmer;
  private tokenizer: natural.WordTokenizer;
  private industryThesaurus: { [key: string]: string[] };

  constructor() {
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();

    this.industryThesaurus = {
      finance: [
        "banking",
        "investment",
        "financial",
        "trading",
        "fintech",
        "monetary",
        "accounting",
        "insurance",
        "wealth",
        "asset",
        "capital",
        "market",
      ],
      healthcare: [
        "medical",
        "health",
        "clinical",
        "patient",
        "hospital",
        "pharmaceutical",
        "biotech",
        "life sciences",
        "therapeutic",
        "diagnosis",
        "treatment",
      ],
      technology: [
        "software",
        "it",
        "computing",
        "digital",
        "tech",
        "cyber",
        "data",
        "cloud",
        "web",
        "development",
        "engineering",
        "systems",
      ],
      retail: [
        "commerce",
        "ecommerce",
        "sales",
        "store",
        "retail",
        "consumer",
        "merchandise",
        "shopping",
        "pos",
        "inventory",
      ],
      manufacturing: [
        "production",
        "factory",
        "assembly",
        "industrial",
        "manufacturing",
        "automation",
        "supply chain",
        "quality control",
        "operations",
      ],
      education: [
        "learning",
        "teaching",
        "academic",
        "education",
        "school",
        "university",
        "training",
        "curriculum",
        "student",
        "instruction",
      ],
      real_estate: [
        "property",
        "housing",
        "realty",
        "land",
        "commercial",
        "residential",
        "development",
        "leasing",
        "brokerage",
        "valuation",
        "construction",
      ],
      energy: [
        "electricity",
        "renewable",
        "oil",
        "gas",
        "solar",
        "wind",
        "nuclear",
        "power",
        "energy",
        "utilities",
        "sustainability",
      ],
      agriculture: [
        "farming",
        "crops",
        "livestock",
        "agriculture",
        "horticulture",
        "fisheries",
        "agribusiness",
        "soil",
        "harvest",
        "food production",
      ],
      transportation: [
        "logistics",
        "shipping",
        "freight",
        "transit",
        "aviation",
        "automotive",
        "rail",
        "maritime",
        "supply chain",
        "distribution",
      ],
      hospitality: [
        "hotel",
        "catering",
        "travel",
        "tourism",
        "restaurant",
        "lodging",
        "hospitality",
        "events",
        "leisure",
        "resort",
        "vacation",
      ],
      media: [
        "broadcast",
        "entertainment",
        "publishing",
        "film",
        "music",
        "news",
        "advertising",
        "content",
        "social media",
        "video",
        "creative",
      ],
      government: [
        "public sector",
        "administration",
        "policy",
        "regulation",
        "law enforcement",
        "military",
        "civic",
        "municipal",
        "federal",
        "taxation",
        "public service",
      ],
    };
  }

  public analyzeIndustryRelevance(
    cv: CV,
    targetIndustry: string
  ): { score: number; reasoning: string } {
    const industry = targetIndustry.toLowerCase();

    // 1. Check for direct industry match
    const exactMatch = cv.industries.some(
      (ind) => ind.toLowerCase() === industry
    );

    if (exactMatch) {
      return {
        score: 100,
        reasoning: `Direct experience in ${targetIndustry}.`,
      };
    }

    // 2. Check for related industries using thesaurus
    const relatedIndustryScores = cv.industries.map((cvInd) =>
      this.getIndustryRelationScore(cvInd, targetIndustry)
    );
    const maxRelatedScore = Math.max(...relatedIndustryScores);

    if (maxRelatedScore > 0) {
      const score = Math.floor(60 + maxRelatedScore * 99); // Scale from 60 to 99
      return {
        score: score,
        reasoning: `Experience in related industry: ${cv.industries.join(
          ", "
        )}.`,
      };
    }

    // 3. Analyze CV content for industry relevance
    const { relevanceScore, terms } = this.analyzeContent(
      cv.full_content,
      targetIndustry
    );

    if (relevanceScore > 0) {
      return {
        score: Math.min(0.6, relevanceScore),
        reasoning: `${targetIndustry} relevant experience found. Keywords: ${terms.join(
          ", "
        )}.`,
      };
    }

    return {
      score: 0,
      reasoning: "No relevant industry experience found.",
    };
  }

  private areIndustriesRelated(industry1: string, industry2: string): boolean {
    const ind1 = industry1.toLowerCase();
    const ind2 = industry2.toLowerCase();

    // Check if industries share common terms in thesaurus
    const terms1 = this.industryThesaurus[ind1] || [];
    const terms2 = this.industryThesaurus[ind2] || [];

    return terms1.some(
      (term) =>
        term === ind2 ||
        terms2.includes(term) ||
        this.stemmer.stem(term) === this.stemmer.stem(ind2)
    );
  }

  private analyzeContent(
    content: string,
    industry: string
  ): { relevanceScore: number; terms: string[] } {
    const tokens = this.tokenizer.tokenize(content.toLowerCase()) || [];
    const industryTerms = new Set([
      industry.toLowerCase(),
      ...(this.industryThesaurus[industry.toLowerCase()] || []),
    ]);

    // Stem all industry terms
    const stemmedIndustryTerms = new Set(
      [...industryTerms].map((term) => this.stemmer.stem(term))
    );

    // Find matching terms
    const matches = new Set<string>();
    tokens.forEach((token) => {
      const stemmed = this.stemmer.stem(token);
      if (stemmedIndustryTerms.has(stemmed)) {
        matches.add(token);
      }
    });

    // Calculate score based on matches
    const relevanceScore = Math.pow(
      matches.size / stemmedIndustryTerms.size,
      1.5
    );
    return {
      relevanceScore,
      terms: Array.from(matches),
    };
  }

  private getIndustryRelationScore(
    industry1: string,
    industry2: string
  ): number {
    const ind1 = industry1.toLowerCase();
    const ind2 = industry2.toLowerCase();

    // Check if industries share common terms in thesaurus
    const terms1 = this.industryThesaurus[ind1] || [];
    const terms2 = this.industryThesaurus[ind2] || [];

    const commonTerms = terms1.filter(
      (term) =>
        term === ind2 ||
        terms2.includes(term) ||
        this.stemmer.stem(term) === this.stemmer.stem(ind2)
    );

    // Calculate similarity score based on common terms
    const similarityScore =
      commonTerms.length / Math.max(terms1.length, terms2.length);
    return similarityScore;
  }
}
