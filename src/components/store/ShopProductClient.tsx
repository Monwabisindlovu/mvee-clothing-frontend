'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types/product';
import { apiFetch } from '@/lib/api';
import ShopProductView from './ShopProductView';

export default function ShopProductClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiFetch<Product>(`/api/products/slug/${slug}`);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  const handleBack = () => {
    if (window.history.state?.fromQuickView) {
      router.back();
    } else {
      router.push('/shop');
    }
  };

  return (
    <>
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        Back
      </button>

      <ShopProductView product={product} />
    </>
  );
}
