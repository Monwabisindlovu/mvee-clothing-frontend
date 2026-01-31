// src/services/product.service.ts
import { Product } from '@/types/product';
import { apiFetch } from '@/lib/api';

const PRODUCTS_PATH = '/api/products';

/* ------------------------------ PRODUCT SERVICE ------------------------------ */
export const ProductService = {
  /* ------------------------------ GET ALL PRODUCTS ------------------------------ */
  getAll: () => apiFetch<Product[]>(PRODUCTS_PATH),

  /* ------------------------------ GET PRODUCT BY ID (ADMIN) ------------------------------ */
  getById: (id: string) => apiFetch<Product>(`${PRODUCTS_PATH}/${id}`),

  /* ------------------------------ GET PRODUCT BY SLUG (FRONTEND) ------------------------------ */
  getBySlug: (slug: string) => apiFetch<Product>(`${PRODUCTS_PATH}/slug/${slug}`),

  /* ------------------------------ CREATE PRODUCT -------------------------------- */
  create: (data: Partial<Product>) =>
    apiFetch<Product>(PRODUCTS_PATH, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /* ------------------------------ UPDATE PRODUCT -------------------------------- */
  update: (id: string, data: Partial<Product>) =>
    apiFetch<Product>(`${PRODUCTS_PATH}/${id}`, {
      method: 'PUT', // ← changed from PATCH to PUT
      body: JSON.stringify(data),
    }),

  /* ------------------------------ DELETE PRODUCT -------------------------------- */
  delete: (id: string) =>
    apiFetch<void>(`${PRODUCTS_PATH}/${id}`, {
      method: 'DELETE',
    }),
};

/* ------------------------------ FETCH PRODUCTS FOR SHOP ------------------------------ */
export async function fetchProducts(): Promise<Product[]> {
  return ProductService.getAll();
}
