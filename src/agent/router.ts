import { generateWithTools } from "../llm/client.js";
import { TOOL_DECLARATIONS, TOOL_FUNCTIONS } from "./tools.js";
import { formatAnswer } from "./format.js";
import { findApi } from "../catalog/queries.js";
import { hasSpec } from "../data/loader.js";

const NAME_ARG: Record<string, string> = {
  directDependents: "target",
  allDependents: "target",
  scoreSpec: "apiName",
  whatIsWrong: "apiName",
  securityIssues: "apiName",
};
const NEEDS_SPEC = new Set(["scoreSpec", "whatIsWrong", "securityIssues"]);

export const routeQuestion = async (question: string) => {
  const { functionCall, text } = await generateWithTools(question, TOOL_DECLARATIONS);

  const call = functionCall?.[0];
  if (!call || !call.name) {
    return { tool: null, result: text, answer: text };
  }

  const argField = NAME_ARG[call.name];
  if (argField) {
    const name = (call.args as any)?.[argField];
    if (!findApi(name)) {
      return { tool: null, result: null, answer: `I don't see an API called "${name}" in the catalog.` };
    }
    if (NEEDS_SPEC.has(call.name) && !hasSpec(name)) {
      return {
        tool: null,
        result: null,
        answer: `"${name}" exists in the catalog, but there's no OpenAPI spec on file for it, so I can't assess its quality.`,
      };
    }
  }

  const fn = TOOL_FUNCTIONS[call.name as keyof typeof TOOL_FUNCTIONS];
  const result = fn(call.args as any);

  if (result === null) {
    return { tool: null, result: null, answer: "No data was found for that request." };
  }

  const answer = formatAnswer(call.name, call.args ?? {}, result);
  return { tool: call.name, args: call.args, result, answer };
};
