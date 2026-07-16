import "dotenv/config";
import {GoogleGenAI} from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || ""
});

const MODEL = "gemini-flash-lite-latest";

const SYSTEM_INSTRUCTION = `You are an assistant for an internal API catalog. Not every API has an OpenAPI spec on file for quality/security assessment.

If a question refers to an API name that does not exist in the catalog, do not guess or substitute an unrelated result as if it answers the question. Say plainly that no such API exists, and suggest close matches only if you are confident they are relevant.

If a question cannot be answered with your available tools, say so honestly instead of forcing an unrelated tool call.`;

export const generateText = async (prompt: string): Promise<string> => {
  const response = await client.models.generateContent({
    model: MODEL,
    contents: [prompt],
    config: {
      temperature: 0.7,
    //   maxOutputTokens: 200,
      thinkingConfig: { thinkingBudget: 0 },
      responseLogprobs: true,
    },
  });
  return response.text ?? "";
};

export const generateWithTools = async (prompt: string, functionDeclarations: any[]) => {
  const response = await client.models.generateContent({
    model: MODEL,
    contents: [prompt],
   
    config: {
      tools: [{functionDeclarations}],
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  if (response.functionCalls && response.functionCalls.length > 0) {
    return { functionCall: response.functionCalls, text: "" };
  }
  return { functionCall: undefined, text: response.text ?? "" };
};
