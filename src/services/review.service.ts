// src/services/review.service.ts
import type { Review } from '@/types/review';
import { apiFetch } from '@/lib/api';

const REVIEWS_PATH = '/api/reviews';

export const ReviewService = {
  /* ------------------------------ GET ALL REVIEWS ------------------------------ */
  getAll: (limit = 20): Promise<Review[]> => apiFetch<Review[]>(`${REVIEWS_PATH}?limit=${limit}`),

  /* ------------------------------ GET REVIEW BY ID ------------------------------ */
  getById: (id: string): Promise<Review> => apiFetch<Review>(`${REVIEWS_PATH}/${id}`),

  /* ------------------------------ UPDATE REVIEW ------------------------------ */
  update: (id: string, payload: Partial<Review>): Promise<Review> =>
    apiFetch<Review>(`${REVIEWS_PATH}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  /* ------------------------------ DELETE REVIEW ------------------------------ */
  delete: (id: string): Promise<void> =>
    apiFetch<void>(`${REVIEWS_PATH}/${id}`, {
      method: 'DELETE',
    }),
};
