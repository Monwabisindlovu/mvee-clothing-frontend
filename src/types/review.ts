// src/types/review.ts

export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  customer_name?: string; // optional, if you want to display names
  rating: number; // e.g. 1–5 stars
  comment?: string; // optional text feedback
  created_date: string; // ISO date string
  updated_date?: string; // optional for edits
}
