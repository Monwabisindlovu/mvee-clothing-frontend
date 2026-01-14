'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

import SizeSelector from '@/components/admin/SizeSelector';
import ColorSelector, { ColorValue } from '@/components/admin/ColorSelector';
import ImageUploader from '@/components/admin/ImageUploader';

import { productService } from '@/services/product.service';
import type { Product, ProductImage } from '@/types/product';
import { base44 } from '@/api/base44Client';

interface ProductFormProps {
  productId?: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  original_price: string;
  category: string;
  subcategory: string;
  images: ProductImage[];
  sizes: string[];
  colors: ColorValue[];
  in_stock: boolean;
  is_featured: boolean;
  is_on_promotion: boolean;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = Boolean(productId);

  const [form, setForm] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    subcategory: '',
    images: [],
    sizes: [],
    colors: [],
    in_stock: true,
    is_featured: false,
    is_on_promotion: false,
  });

  /* ----------------------------- fetch product ----------------------------- */

  const { data: product, isLoading } = useQuery<Product | null>({
    queryKey: ['product', productId],
    enabled: !!productId,
    queryFn: async () => {
      const p = await productService.getById(productId!);
      return p ?? null;
    },
  });

  useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name,
      description: product.description ?? '',
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : '',
      category: product.category,
      subcategory: '',
      images: product.images ?? [],
      sizes: product.sizes ?? [],
      colors: product.colors ?? [],
      in_stock: product.in_stock,
      is_featured: product.is_featured,
      is_on_promotion: product.is_on_promotion,
    });
  }, [product]);

  /* ---------------------------- mutations --------------------------- */

  const createMutation = useMutation<unknown, Error, Partial<Product>>({
    mutationFn: data => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created');
      router.push('/admin/products');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) => productService.update(productId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated');
      router.push('/admin/products');
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  /* ----------------------------- submit ---------------------------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      toast.error('Missing required fields');
      return;
    }

    const payload: Partial<Product> = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      category: form.category,
      images: form.images,
      sizes: form.sizes,
      colors: form.colors,
      in_stock: form.in_stock,
      is_featured: form.is_featured,
      is_on_promotion: form.is_on_promotion,
    };

    isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <Button onClick={handleSubmit} disabled={isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Images */}
        <Card>
          <div className="p-4 border-b font-semibold">Images</div>
          <div className="p-4">
            <ImageUploader
              value={form.images}
              onChange={images => setForm(f => ({ ...f, images }))}
              uploadFile={async (file: File) => {
                // Replace with your actual uploader
                const { file_url } = await base44.integrations.Core.UploadFile({ file });
                return file_url;
              }}
            />
          </div>
        </Card>

        {/* Sizes */}
        <Card>
          <div className="p-4 border-b font-semibold">Sizes</div>
          <div className="p-4">
            <SizeSelector value={form.sizes} onChange={sizes => setForm(f => ({ ...f, sizes }))} />
          </div>
        </Card>

        {/* Colors */}
        <Card>
          <div className="p-4 border-b font-semibold">Colors</div>
          <div className="p-4">
            <ColorSelector
              value={form.colors}
              onChange={colors => setForm(f => ({ ...f, colors }))}
            />
          </div>
        </Card>

        {/* Basic Info */}
        <Card>
          <div className="p-4 border-b font-semibold">Product Info</div>
          <div className="p-4 space-y-4">
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Product Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2"
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              />
              <input
                className="flex-1 border rounded px-3 py-2"
                placeholder="Original Price"
                type="number"
                value={form.original_price}
                onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))}
              />
            </div>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Category"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            />
          </div>
        </Card>

        {/* Toggles */}
        <Card>
          <div className="p-4 border-b font-semibold">Options</div>
          <div className="p-4 flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.in_stock}
                onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))}
              />
              In Stock
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_on_promotion}
                onChange={e => setForm(f => ({ ...f, is_on_promotion: e.target.checked }))}
              />
              On Promotion
            </label>
          </div>
        </Card>
      </main>
    </div>
  );
}
