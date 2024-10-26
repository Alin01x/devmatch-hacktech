// Industry Knowledge Criteria (10%)
// Technical Skills Criteria (30%)
// Job Description and CV Matching (60%)

export const getFinalMatchingScore = (
  industryScore: number,
  technicalScore: number,
  overallScore: number
) => {
  return industryScore * 0.1 + technicalScore * 0.3 + overallScore * 0.6;
};
