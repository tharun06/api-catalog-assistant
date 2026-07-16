import { assessSpec } from "./assess.js";
import { listSpecNames , loadRubric } from "../data/loader.js";

const SEVERITY_WEIGHT: Record<string, number> = { low: 1, medium: 2, high: 3 };

export const scoreSpec = (apiName: string) => {
  const specAssessment = assessSpec(apiName);
  if (!specAssessment) return null;

  const rubric = loadRubric();
  let totalScore = 0;
  let maxScore = 0;

  for (const rule of rubric) {
    const ruleWeight = SEVERITY_WEIGHT[rule.severity] || 1;
    maxScore += ruleWeight;
  }

  for (const assessment of specAssessment) {
    const rule = rubric.find((r) => r.id === assessment.id);
    if (rule) {
      const ruleWeight = SEVERITY_WEIGHT[rule.severity] || 1;
      if (!assessment.passed) {
        totalScore += ruleWeight;
      }
    }
  }

  const score = maxScore > 0 ? Math.round(((maxScore - totalScore) / maxScore) * 100) : 100;
  return { apiName, score, results: specAssessment };
};

export const rankSpecs = (apiNames: string[]) => {
  return apiNames
    .map((name) => scoreSpec(name))
    .filter((v): v is NonNullable<typeof v> => !!v)
    .sort((a, b) => b.score - a.score);
};