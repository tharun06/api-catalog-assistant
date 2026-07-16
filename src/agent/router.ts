import { generateWithTools } from "../llm/client.js";
import { TOOL_DECLARATIONS, TOOL_FUNCTIONS } from "./tools.js";
import { formatAnswer } from "./format.js";

export const routeQuestion = async (question: string) => {
  const { functionCall, text } = await generateWithTools(question, TOOL_DECLARATIONS);

  const call = functionCall?.[0];
  if (!call || !call.name) {
    return { tool: null, result: text, answer: text };
  }

  const fn = TOOL_FUNCTIONS[call.name as keyof typeof TOOL_FUNCTIONS];
  const result = fn(call.args as any);
  const answer = formatAnswer(call.name, call.args ?? {}, result);

  return { tool: call.name, args: call.args, result, answer };
};