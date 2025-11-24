import { Restaurant } from "../types";
import { buildRestaurantDocument } from "./vectorPipeline";
import { QueryFilters, restaurantVectorStore } from "./vectorStore";

export interface BatchIndexSummary {
  indexed: number;
  collection: string;
}

export const runBatchIndexing = async (restaurants: Restaurant[]): Promise<BatchIndexSummary> => {
  const documents = await Promise.all(restaurants.map((restaurant) => buildRestaurantDocument(restaurant)));
  restaurantVectorStore.clear();
  restaurantVectorStore.upsertMany(documents);
  return { indexed: documents.length, collection: "restaurants" };
};

export const upsertIncrementalRestaurants = async (restaurants: Restaurant[]): Promise<BatchIndexSummary> => {
  const documents = await Promise.all(restaurants.map((restaurant) => buildRestaurantDocument(restaurant)));
  restaurantVectorStore.upsertMany(documents);
  return { indexed: documents.length, collection: "restaurants" };
};

export const warmCollectionWithFilters = async (
  restaurants: Restaurant[],
  filters?: QueryFilters
): Promise<BatchIndexSummary> => {
  const filtered = filters
    ? restaurants.filter((restaurant) => {
        if (filters.category && restaurant.category !== filters.category) return false;
        const targetBudget = filters.budget ?? filters.priceRange;
        if (targetBudget && restaurant.price_range !== targetBudget) return false;
        if (filters.location && !restaurant.address.toLowerCase().includes(filters.location.toLowerCase())) return false;
        return true;
      })
    : restaurants;

  return runBatchIndexing(filtered);
};
