import { GoogleGenAI } from "@google/genai";
import { FacebookPost } from '../types';

export const analyzePosts = async (posts: FacebookPost[]): Promise<string> => {
  // Always use process.env.API_KEY directly when initializing the client.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare a summarized version of the posts to save tokens
  const postsSummary = posts.slice(0, 20).map(p => ({
    author: p.author.name,
    content: p.content.substring(0, 200),
    stats: p.stats,
    type: p.mediaType
  }));

  const prompt = `
    Analyze the following social media posts data.
    Provide a concise bird's-eye view summary (max 3 paragraphs).
    Focus on:
    1. Overall sentiment and recurring themes.
    2. Which type of content (Video, Image, Text) is performing best based on engagement (likes + comments + shares).
    3. Any standout outliers.

    Data:
    ${JSON.stringify(postsSummary, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};