// src/services/order.service.ts
import type { Order } from '@/types/order';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

export class OrderService {
  // Fetch all orders (with optional limit)
  static async getAll(limit = 50): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data as Order[];
  }

  // Fetch single order by ID
  static async getById(id: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error('Failed to fetch order');
    const data = await res.json();
    return data as Order;
  }

  // Update order
  static async update(id: string, payload: Partial<Order>): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update order');
    const data = await res.json();
    return data as Order;
  }

  // Delete order
  static async delete(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete order');
  }
}
