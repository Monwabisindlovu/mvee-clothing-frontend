// src/services/category.service.ts
import { Category } from '@/types/category';
import { apiFetch } from '@/lib/api';

export const CategoryService = {
  /* ------------------------------ GET ALL CATEGORIES ------------------------------ */
  getAll: (): Promise<Category[]> => apiFetch<Category[]>('/api/categories'),

  /* ------------------------------ CREATE CATEGORY ------------------------------ */
  create: (data: Partial<Category>): Promise<Category> =>
    apiFetch<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /* ------------------------------ DELETE CATEGORY ------------------------------ */
  delete: (id: string): Promise<void> =>
    apiFetch<void>(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
};
