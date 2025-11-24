import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MOCK_RESTAURANTS } from "./mockData";
import { RecommendationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for strict JSON output
const recommendationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "The UUID of the restaurant from the provided list." },
          match_score: { type: Type.INTEGER, description: "A score from 0 to 100 indicating how well it fits the query." },
          reason: { type: Type.STRING, description: "A concise, persuasive reason in Korean explaining why this fits." },
          tags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "3 short Korean hashtags summarizing the vibe (e.g., #조용한, #데이트)" 
          }
        },
        required: ["id", "match_score", "reason", "tags"]
      }
    }
  },
  required: ["results"]
};

export const searchRestaurants = async (userQuery: string): Promise<RecommendationResult[]> => {
  // 1. Prepare the context (Mock RAG)
  const dataContext = MOCK_RESTAURANTS.map(r => ({
    id: r.id,
    name: r.name,
    category: r.category,
    reviews: r.reviews.map(rev => rev.content).join(" | ")
  }));

  const prompt = `
    You are a high-end, knowledgeable AI Restaurant Concierge for Seoul, Korea.
    
    My Query: "${userQuery}"

    Here is the database of available restaurants with summary of reviews:
    ${JSON.stringify(dataContext, null, 2)}

    Task:
    1. Analyze the reviews and metadata to find the best matches for my query.
    2. Rank them by relevance.
    3. Return ONLY the top 3-4 matches.
    4. If nothing fits well, return the best partial matches but with lower scores.
    5. 'match_score' should be high (85-100) for great fits, medium (60-84) for okay fits.
    6. 'reason' MUST be in natural, polite Korean (해요체). Cite specific details from the reviews to sound convincing (e.g., "리뷰에서 언급된 조명 분위기가...").
    7. 'tags' MUST be in Korean.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
        temperature: 0.3,
      }
    });

    const outputText = response.text;
    if (!outputText) throw new Error("No response from AI");

    const parsedData = JSON.parse(outputText);
    const results = parsedData.results || [];

    // Hydrate the results with the full static data (images, urls, etc.)
    const hydratedResults: RecommendationResult[] = results.map((res: any) => {
      const original = MOCK_RESTAURANTS.find(r => r.id === res.id);
      if (!original) return null;
      
      return {
        ...res,
        name: original.name,
        external_url: original.external_map_url,
        image_url: original.image_url,
        category: original.category,
        price_range: original.price_range
      };
    }).filter((item: any) => item !== null);

    return hydratedResults.sort((a, b) => b.match_score - a.match_score);

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw new Error("추천 정보를 가져오는 데 실패했습니다. 다시 시도해 주세요.");
  }
};