import "dotenv/config";
import {GoogleGenAI} from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || ""
});

const MODEL = "gemini-flash-lite-latest";

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
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  return {functionCall: response.functionCalls, text: response.text ?? ""};
};
