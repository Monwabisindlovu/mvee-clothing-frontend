// src/app/shop/page.tsx
'use client';

import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';

export default function ShopPage() {
  const { products } = useProducts();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product} // ✅ pass the full product object
        />
      ))}
    </div>
  );
}
