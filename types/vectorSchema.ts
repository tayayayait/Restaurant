import { Restaurant } from "../types";

export interface VectorMetadata {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  address: string;
  tags: string[];
  keywords: string[];
  rating?: number;
}

export interface VectorDocument {
  id: string;
  values: number[];
  metadata: VectorMetadata;
  normalizedText: string;
  rawText: string;
  raw: Restaurant;
}
