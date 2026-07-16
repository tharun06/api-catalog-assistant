import { scoreSpec } from "./score.js";
import { loadRubric } from "../data/loader.js";

// S06: What's wrong with the inventory-api spec? Give me concrete fixes.
export const whatIsWrong = (apiName: string) => {
  const specAssessment = scoreSpec(apiName);
  if (!specAssessment) return null;

  const rubric = loadRubric();
  const failedRules = specAssessment.results.filter((result) => !result.passed);
  const problems = failedRules.map((result) => {
    const rule = rubric.find((r) => r.id === result.id);
    return { id: result.id, severity: rule?.severity ?? "low", details: result.details };
  });

  return { apiName: specAssessment.apiName, score: specAssessment.score, problems };
};

// S07: Does the shipping-api spec have any security problems?
export const securityIssues = (apiName: string) => {
  const assessment = whatIsWrong(apiName);
  if (!assessment) return null;

  const problems = assessment.problems.filter((problem) => problem.id.startsWith("SEC"));
  return { apiName: assessment.apiName, score: assessment.score, problems };
};
