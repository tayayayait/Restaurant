import { Restaurant } from "../types";
import { RestaurantMetadata, VectorDocument } from "./vectorPipeline";

export interface QueryFilters {
  category?: string;
  priceRange?: string;
  location?: string;
}

export interface QueryOptions {
  topK?: number;
  filters?: QueryFilters;
}

export interface VectorSearchResult {
  metadata: RestaurantMetadata;
  score: number;
  document: VectorDocument;
}

export class InMemoryVectorStore {
  private readonly collection: string;
  private vectors: Map<string, VectorDocument> = new Map();
  private dimensions: number | null = null;

  constructor(collection: string) {
    this.collection = collection;
  }

  clear(): void {
    this.vectors.clear();
    this.dimensions = null;
  }

  upsertMany(documents: VectorDocument[]): void {
    documents.forEach((doc) => this.upsert(doc));
  }

  upsert(document: VectorDocument): void {
    if (document.values.length === 0) return;
    if (this.dimensions === null) {
      this.dimensions = document.values.length;
    }
    if (this.dimensions !== document.values.length) {
      throw new Error(
        `Dimension mismatch for collection ${this.collection}. Expected ${this.dimensions}, received ${document.values.length}`
      );
    }
    this.vectors.set(document.id, document);
  }

  query(queryVector: number[], options: QueryOptions = {}): VectorSearchResult[] {
    if (queryVector.length === 0 || this.vectors.size === 0) return [];

    const topK = options.topK ?? 5;
    const filters = options.filters;

    const results: VectorSearchResult[] = [];

    this.vectors.forEach((doc) => {
      if (filters && !this.passesFilter(doc.raw, filters)) return;

      const score = this.cosineSimilarity(queryVector, doc.values);
      results.push({ metadata: doc.metadata, score, document: doc });
    });

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  private passesFilter(restaurant: Restaurant, filters: QueryFilters): boolean {
    if (filters.category && restaurant.category !== filters.category) return false;
    if (filters.priceRange && restaurant.price_range !== filters.priceRange) return false;
    if (filters.location) {
      const normalizedAddress = restaurant.address.toLowerCase();
      if (!normalizedAddress.includes(filters.location.toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const length = Math.min(vectorA.length, vectorB.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < length; i++) {
      dot += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB) || 1;
    return dot / denominator;
  }
}

export const restaurantVectorStore = new InMemoryVectorStore("restaurants");
