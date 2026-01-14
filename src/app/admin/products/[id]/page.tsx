'use client';

import ProductForm from '@/components/admin/ProductForm';

interface ProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: ProductPageProps) {
  return <ProductForm productId={params.id} />;
}
