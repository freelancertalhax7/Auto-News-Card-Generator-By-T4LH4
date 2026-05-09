import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiModel = {
  extractAndSummarize: async (text: string, title?: string) => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract the core news headline and a concise 1-2 sentence summary from this content. 
      Format the response as JSON with keys "title" and "excerpt". 
      Title should be catchy, summary should be strictly under 150 characters.
      Content: ${text}
      ${title ? `Original Title: ${title}` : ""}`,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "{}");
  },
};
