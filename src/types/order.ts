// src/types/order.ts
import { ReactNode } from 'react';

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface Order {
  customer_name: ReactNode;
  created_date: string | number | Date;
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at?: string;
}
