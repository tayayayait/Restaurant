import { MOCK_RESTAURANTS } from "./mockData";
import { RecommendationResult, SearchFilters } from "../types";
import {
  buildReasonFromReviews,
  buildRestaurantDocument,
  buildTagsFromRestaurant,
  cleanText,
  embedText
} from "./vectorPipeline";
import { restaurantVectorStore } from "./vectorStore";

const indexingPromise = (async () => {
  const documents = await Promise.all(MOCK_RESTAURANTS.map((restaurant) => buildRestaurantDocument(restaurant)));
  restaurantVectorStore.clear();
  restaurantVectorStore.upsertMany(documents);
})();

const hydrateResults = (results: RecommendationResult[]): RecommendationResult[] => {
  return results
    .map((result) => {
      const original = MOCK_RESTAURANTS.find((r) => r.id === result.id);
      if (!original) return null;

      return {
        ...result,
        external_url: original.external_map_url,
        image_url: original.image_url,
        category: original.category,
        price_range: original.price_range,
        address: original.address
      };
    })
    .filter((item): item is RecommendationResult => item !== null)
    .sort((a, b) => b.match_score - a.match_score);
};

export const searchRestaurants = async (
  userQuery: string,
  filters?: SearchFilters
): Promise<RecommendationResult[]> => {
  await indexingPromise;
  const cleanedQuery = cleanText(userQuery);
  const queryVector = await embedText(cleanedQuery);

  const vectorResults = restaurantVectorStore.query(queryVector, {
    topK: 4,
    filters
  });

  const formatted: RecommendationResult[] = vectorResults.map((result) => {
    const { raw } = result.document;
    const match_score = Math.min(100, Math.max(0, Math.round(result.score * 100)));

    return {
      id: raw.id,
      name: raw.name,
      match_score,
      reason: buildReasonFromReviews(raw),
      tags: buildTagsFromRestaurant(raw),
      external_url: raw.external_map_url,
      image_url: raw.image_url,
      category: raw.category,
      price_range: raw.price_range,
      address: raw.address
    };
  });

  return hydrateResults(formatted);
};
