// src/api/base44Client.ts

import type { Product } from '@/types/product';
import type { Order } from '@/types/order';
import type { Review } from '@/types/review';

type ListResult<T> = Promise<T[]>;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const base44 = {
  entities: {
    Product: {
      async list(p0: string, p1: number): ListResult<Product> {
        await delay(300);
        return [
          {
            id: 'p1',
            name: 'MVEE Classic Hoodie',
            slug: 'mvee-classic-hoodie',
            description: 'A timeless hoodie with premium cotton blend.',
            category: 'hoodies',
            price: 899,
            original_price: 999,
            in_stock: true,
            stock: 25,
            is_featured: true,
            is_on_promotion: true,
            created_at: new Date().toISOString(),
            images: [
              { id: 'img1', url: '/images/products/hoodie-black-1.jpg', alt: 'Black Hoodie Front' },
              { id: 'img2', url: '/images/products/hoodie-black-2.jpg', alt: 'Black Hoodie Back' },
            ],
            sizes: ['S', 'M', 'L', 'XL'],
            colors: [
              { name: 'Black', hex: '#000000' },
              { name: 'Grey', hex: '#808080' },
            ],
          },
          {
            id: 'p2',
            name: 'MVEE Signature Tee',
            slug: 'mvee-signature-tee',
            description: 'Soft cotton tee with MVEE logo.',
            category: 't-shirts',
            price: 399,
            in_stock: true,
            stock: 50,
            is_featured: false,
            is_on_promotion: false,
            created_at: new Date().toISOString(),
            images: [
              { id: 'img3', url: '/images/products/tee-white-1.jpg', alt: 'White Tee Front' },
            ],
            sizes: ['S', 'M', 'L'],
            colors: [
              { name: 'White', hex: '#FFFFFF' },
              { name: 'Black', hex: '#000000' },
            ],
          },
        ];
      },
    },

    Order: {
      async list(): ListResult<Order> {
        await delay(300);
        return [
          {
            id: 'o1',
            customer_name: 'John Doe',
            status: 'pending',
            total: 1298,
            items: [],
            created_date: new Date().toISOString(),
          },
        ];
      },
    },

    Review: {
      async list(): ListResult<Review> {
        await delay(300);
        return [
          {
            id: 'r1',
            rating: 5,
            product_id: 'p1',
            customer_id: 'c1',
            created_date: new Date().toISOString(),
          },
          {
            id: 'r2',
            rating: 4,
            product_id: 'p2',
            customer_id: 'c2',
            created_date: new Date().toISOString(),
          },
        ];
      },
    },
  },
};
