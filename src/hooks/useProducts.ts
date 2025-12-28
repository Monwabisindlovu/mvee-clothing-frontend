// src/hooks/useProducts.ts
'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';

type ProductFilters = {
  category?: string | 'all';
  inStock?: boolean;
  featured?: boolean;
};

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        // Mock products
        const allProducts: Product[] = [
          {
            id: '1',
            name: 'Classic T-shirt',
            price: 299,
            image: '/mens-t-shirt.png',
            category: 'men',
            isActive: true,
            stock: 10,
            featured: true,
            slug: 'classic-tshirt',
            sizes: ['S', 'M', 'L'],
            colors: ['red', 'blue'],
            images: [],
          },
          {
            id: '2',
            name: 'Slim Jeans',
            price: 499,
            image: '/Slim-Jeans.png',
            category: 'women',
            isActive: true,
            stock: 5,
            featured: false,
            slug: 'slim-jeans',
            sizes: ['S', 'M'],
            colors: ['black', 'blue'],
            images: [],
          },
          {
            id: '3',
            name: 'Kids Hoodie',
            price: 199,
            image: '/Kids Hoodie.png',
            category: 'kids',
            isActive: true,
            stock: 0,
            featured: true,
            slug: 'kids-hoodie',
            sizes: ['XS', 'S'],
            colors: ['yellow', 'green'],
            images: [],
          },
        ];

        // Apply filters
        const filtered = allProducts.filter(product => {
          if (
            filters.category &&
            filters.category !== 'all' &&
            product.category !== filters.category
          ) {
            return false;
          }
          if (filters.inStock && (product.stock ?? 0) <= 0) {
            return false;
          }
          if (filters.featured && !product.featured) {
            return false;
          }
          return product.isActive !== false;
        });

        setProducts(filtered);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return {
    products,
    isLoading,
    error,
  };
}
