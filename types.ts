export interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  external_map_url: string;
  image_url: string;
  price_range: string; // $, $$, $$$, $$$$
  reviews: Review[];
}

export interface Review {
  content: string;
}

export interface RecommendationResult {
  id: string;
  name: string;
  match_score: number;
  reason: string;
  tags: string[];
  external_url: string;
  image_url: string; // Added to join with mock data
  category: string; // Added to join with mock data
  price_range: string;
  address?: string;
}

export interface SearchFilters {
  category?: string;
  priceRange?: string;
  location?: string;
}

export enum SearchState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  EMPTY = 'EMPTY'
}
