// app/shop/[slug]/head.tsx
'use client';

import type { Product } from '@/types/product';
import { apiFetch } from '@/lib/api';

interface HeadProps {
  params: {
    slug: string;
  };
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/api/products/slug/${slug}`);
  } catch {
    return null;
  }
}

export default async function Head({ params }: HeadProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <>
        <title>Product Not Found</title>
        <meta name="robots" content="noindex" />
      </>
    );
  }

  const title = `${product.name} | Your Store Name`;
  const description =
    product.short_description?.slice(0, 160) || 'Check out this product at Your Store Name';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {product.images?.[0]?.url && <meta property="og:image" content={product.images[0].url} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {product.images?.[0]?.url && <meta name="twitter:image" content={product.images[0].url} />}
    </>
  );
}
