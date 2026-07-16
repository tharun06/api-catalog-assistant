import "dotenv/config";
import {GoogleGenAI} from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || ""
});

export const generateText = async (prompt: string): Promise<string> => {
  const response = await client.models.generateContent({
    model: "gemini-flash-latest",
    contents: [prompt],
    config: {
      temperature: 0.7,
    //   maxOutputTokens: 200,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  return response.text ?? "";
};