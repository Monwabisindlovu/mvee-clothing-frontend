// src/types/category.ts

export interface Category {
  id: string; // Unique identifier
  name: string; // Category name
  created_at?: string; // Optional: creation timestamp
  updated_at?: string; // Optional: last update timestamp
}
