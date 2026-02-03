// src/services/order.service.ts
import type { Order } from '@/types/order';
import { apiFetch } from '@/lib/api';

const ORDERS_PATH = '/api/orders';

export class OrderService {
  // Fetch all orders (with optional limit)
  static getAll(limit = 50): Promise<Order[]> {
    const query = limit ? `?limit=${limit}` : '';
    return apiFetch<Order[]>(`${ORDERS_PATH}${query}`);
  }

  // Fetch single order by ID
  static getById(id: string): Promise<Order> {
    return apiFetch<Order>(`${ORDERS_PATH}/${id}`);
  }

  // Update order
  static update(id: string, payload: Partial<Order>): Promise<Order> {
    return apiFetch<Order>(`${ORDERS_PATH}/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  }

  // Delete order
  static delete(id: string): Promise<void> {
    return apiFetch<void>(`${ORDERS_PATH}/${id}`, { method: 'DELETE' });
  }
}
