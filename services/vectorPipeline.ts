import { Restaurant } from "../types";
import { VectorDocument, VectorMetadata } from "../types/vectorSchema";

const embeddingModel = "text-embedding-004";
const apiKey = process.env.GEMINI_API_KEY;

export const cleanText = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/[\n\r]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
};

const buildRestaurantText = (restaurant: Restaurant): { rawText: string; normalizedText: string } => {
  const reviewContent = restaurant.reviews.map((review) => review.content).join(" ");
  const rawText = [restaurant.name, restaurant.category, restaurant.address, reviewContent]
    .filter(Boolean)
    .join(" | ");

  return {
    rawText,
    normalizedText: cleanText(rawText)
  };
};

const fallbackEmbedding = (text: string, dimensions = 128): number[] => {
  const vector = new Array(dimensions).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const index = charCode % dimensions;
    vector[index] += (charCode % 13) / 13;
  }
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vector.map((val) => val / magnitude);
};

export const embedText = async (text: string): Promise<number[]> => {
  if (!text) return [];

  if (!apiKey) {
    return fallbackEmbedding(text);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: embeddingModel,
          content: { parts: [{ text }] }
        })
      }
    );

    if (!response.ok) {
      return fallbackEmbedding(text);
    }

    const data = await response.json();
    const values = data?.embedding?.values as number[] | undefined;
    if (Array.isArray(values) && values.length > 0) {
      return values;
    }

    return fallbackEmbedding(text);
  } catch (error) {
    console.error("Embedding request failed, using fallback vector.", error);
    return fallbackEmbedding(text);
  }
};

export const buildRestaurantDocument = async (restaurant: Restaurant): Promise<VectorDocument> => {
  const { normalizedText, rawText } = buildRestaurantText(restaurant);
  const values = await embedText(normalizedText);

  const tags = buildTagsFromRestaurant(restaurant);
  const keywords = Array.from(
    new Set([
      cleanText(restaurant.category),
      cleanText(restaurant.price_range),
      cleanText(restaurant.address),
      ...tags.map((tag) => cleanText(tag.replace(/^#/, "")))
    ])
  ).filter(Boolean);

  const metadata: VectorMetadata = {
    id: restaurant.id,
    name: restaurant.name,
    category: restaurant.category,
    priceRange: restaurant.price_range,
    address: restaurant.address,
    rating: restaurant.rating,
    tags,
    keywords
  };

  return {
    id: restaurant.id,
    values,
    metadata,
    normalizedText,
    rawText,
    raw: restaurant
  };
};

export const buildReasonFromReviews = (restaurant: Restaurant): string => {
  const snippets = restaurant.reviews
    .map((review) => review.content.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (snippets.length === 0) {
    return `${restaurant.name}는 ${restaurant.category} 카테고리의 매장으로 ${restaurant.address}에 있습니다.`;
  }

  return snippets
    .map((snippet, index) => `리뷰 ${index + 1}: ${snippet}`)
    .join(" | ");
};

export const buildTagsFromRestaurant = (restaurant: Restaurant): string[] => {
  const tags = new Set<string>();
  tags.add(`#${cleanText(restaurant.category)}`);
  tags.add(`#${restaurant.price_range.replace(/\$/g, "원")}대`);

  const vibeWords = ["조용", "데이트", "가족", "회식", "매운", "가성비", "오마카세"];
  vibeWords.forEach((word) => {
    const hasWord = restaurant.reviews.some((review) => review.content.includes(word));
    if (hasWord) {
      tags.add(`#${word}`);
    }
  });

  return Array.from(tags).slice(0, 4);
};
