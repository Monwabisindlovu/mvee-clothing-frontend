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

        const allProducts: Product[] = [
          {
            id: '1',
            name: 'Classic T-shirt',
            slug: 'classic-tshirt',
            price: 299,
            image: '/mens-t-shirt.png',
            images: ['/mens-t-shirt.png', '/mens-t-shirt.png'],
            category: 'men',
            subcategory: 'tshirts',
            description: 'A premium cotton classic T-shirt suitable for everyday wear.',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'White', 'Grey'],
            stock: 50,
            featured: true,
            isActive: true,
          },
          {
            id: '2',
            name: 'Slim Jeans',
            slug: 'slim-jeans',
            price: 499,
            image: '/Slim-Jeans.png',
            images: ['/Slim-Jeans.png', '/Slim-Jeans.png'],
            category: 'women',
            subcategory: 'jeans',
            description: 'Modern slim-fit jeans designed for comfort and style.',
            sizes: ['S', 'M', 'L'],
            colors: ['Black', 'Blue'],
            stock: 15,
            featured: false,
            isActive: true,
          },
          {
            id: '3',
            name: 'Kids Hoodie',
            slug: 'kids-hoodie',
            price: 199,
            image: '/Kids Hoodie.png',
            images: ['/Kids Hoodie.png', '/Kids Hoodie.png'],
            category: 'kids',
            subcategory: 'hoodies',
            description: 'Warm and comfortable hoodie for kids.',
            sizes: ['XS', 'S'],
            colors: ['Yellow', 'Green'],
            stock: 0,
            featured: true,
            isActive: true,
          },
        ];

        const filtered = allProducts.filter(product => {
          if (
            filters.category &&
            filters.category !== 'all' &&
            product.category !== filters.category
          ) {
            return false;
          }

          if (filters.inStock && product.stock <= 0) {
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
