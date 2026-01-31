// src/services/review.service.ts
import type { Review } from '@/types/review';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

export class ReviewService {
  // Fetch all reviews (with optional limit)
  static async getAll(limit = 20): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const data = await res.json();
    return data as Review[];
  }

  // Fetch single review by ID
  static async getById(id: string): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews/${id}`);
    if (!res.ok) throw new Error('Failed to fetch review');
    const data = await res.json();
    return data as Review;
  }

  // Update review
  static async update(id: string, payload: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update review');
    const data = await res.json();
    return data as Review;
  }

  // Delete review
  static async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete review');
  }
}
