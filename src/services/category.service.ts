// src/services/category.service.ts
import { Category } from '@/types/category';
import { apiFetch } from '@/lib/api';

export const CategoryService = {
  /* ------------------------------ GET ALL CATEGORIES ------------------------------ */
  getAll: () => apiFetch<Category[]>('/api/categories'),

  /* ------------------------------ CREATE CATEGORY ------------------------------ */
  create: (data: Partial<Category>, token?: string) =>
    apiFetch<Category>('/api/categories', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(data),
    }),

  /* ------------------------------ DELETE CATEGORY ------------------------------ */
  delete: (id: string, token?: string) =>
    apiFetch<void>(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
};
