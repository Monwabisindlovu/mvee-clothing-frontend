'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import SizeSelector from '@/components/admin/SizeSelector';
import ColorSelector, { ColorValue } from '@/components/admin/ColorSelector';
import ImageUploader from '@/components/admin/ImageUploader';

import { ProductService } from '@/services/product.service';
import generateSlug from '@/utils/generateSlug';

import type { Product, ProductImage } from '@/types/product';

const CATEGORIES = ['men', 'women'];

const PRESET_TYPES = [
  'men-suits',
  'men-blazers',
  'men-formal-shirts',
  'men-trousers',
  'men-waistcoats',
  'men-formal-shoes',
  'men-ties',
  'women-suits',
  'women-blazers',
  'women-dresses',
  'women-formal-shirts',
  'women-blouses',
  'women-skirts',
  'women-trousers',
  'women-heels',
  'women-handbags',
  'women-formal-shoes',
  'accessories',
];

interface ProductFormProps {
  productId?: string;
}

interface FormState {
  name: string;
  short_description: string;
  description: string;
  category: string;
  type: string;
  custom_type: string;
  price: string;
  original_price: string;
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

  const [form, setForm] = useState<FormState>({
    name: '',
    short_description: '',
    description: '',
    category: '',
    type: '',
    custom_type: '',
    price: '',
    original_price: '',
    images: [],
    sizes: [],
    colors: [],
    in_stock: true,
    is_featured: false,
    is_on_promotion: false,
  });

  /* ------------------------ Fetch existing product ------------------------ */
  const { data: product, isLoading } = useQuery<Product | null>({
    queryKey: ['product', productId],
    enabled: !!productId,
    queryFn: () => ProductService.getById(productId!),
  });

  useEffect(() => {
    if (!product) return;

    const isPresetType = PRESET_TYPES.includes(product.type ?? '');
    setForm({
      name: product.name,
      short_description: product.short_description ?? '',
      description: product.description ?? '',
      category: product.category,
      type: isPresetType ? product.type! : '',
      custom_type: isPresetType ? '' : (product.type ?? ''),
      price: String(product.price),
      original_price: product.original_price ? String(product.original_price) : '',
      images:
        product.images?.map(img => ({
          id: crypto.randomUUID(),
          url: img.url,
          alt: img.alt ?? '',
          is_main: img.is_main ?? false,
        })) ?? [],
      sizes: product.sizes ?? [],
      colors: product.colors ?? [],
      in_stock: product.in_stock,
      is_featured: product.is_featured,
      is_on_promotion: product.is_on_promotion,
    });
  }, [product]);

  /* ---------------------------- Mutations ---------------------------- */
  const createMutation = useMutation({
    mutationFn: (data: Partial<Product>) => ProductService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created');
      router.push('/admin/products');
    },
    onError: () => toast.error('Failed to create product'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) => ProductService.update(productId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated');
      router.push('/admin/products');
    },
    onError: () => toast.error('Failed to update product'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  /* ----------------------------- Submit ----------------------------- */
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!form.name || !form.price || !form.category || (!form.type && !form.custom_type)) {
      toast.error('Please fill all required fields');
      return;
    }

    const slug = generateSlug(form.name);

    const payload: Partial<Product> = {
      name: form.name,
      slug,
      short_description: form.short_description,
      description: form.description,
      category: form.category,
      type: form.custom_type || form.type,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      images: form.images.map((img, index) => ({ ...img, is_main: index === 0 })),
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
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">{isEditing ? 'Edit Product' : 'Add Product'}</h1>
          </div>

          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Product Name *</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <Label>Short Description (for Quick View)</Label>
                <Textarea
                  rows={2}
                  placeholder="Elegant white dress perfect for date night and office wear."
                  value={form.short_description}
                  onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))}
                />
              </div>

              <div>
                <Label>Full Description (for Product Page)</Label>
                <Textarea
                  rows={5}
                  placeholder="Victoria is a tailored white dress designed for elegance and comfort. Made with breathable fabric, it transitions seamlessly from office wear to evening outings..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={form.category}
                    onValueChange={v => setForm(f => ({ ...f, category: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type *</Label>
                  <Select
                    value={form.type}
                    onValueChange={v => setForm(f => ({ ...f, type: v, custom_type: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESET_TYPES.map(t => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    className="mt-2"
                    placeholder="Or enter custom type"
                    value={form.custom_type}
                    onChange={e => setForm(f => ({ ...f, custom_type: e.target.value, type: '' }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <SizeSelector
                value={form.sizes}
                onChange={sizes => setForm(f => ({ ...f, sizes }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorSelector
                value={form.colors}
                onChange={colors => setForm(f => ({ ...f, colors }))}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Original price"
                value={form.original_price}
                onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusRow
                label="In Stock"
                description="Available for purchase"
                checked={form.in_stock}
                onChange={v => setForm(f => ({ ...f, in_stock: v }))}
              />
              <StatusRow
                label="Featured"
                description="Show on homepage"
                checked={form.is_featured}
                onChange={v => setForm(f => ({ ...f, is_featured: v }))}
              />
              <StatusRow
                label="On Promotion"
                description="Discounted product"
                checked={form.is_on_promotion}
                onChange={v => setForm(f => ({ ...f, is_on_promotion: v }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={form.images}
                onChange={images => setForm(f => ({ ...f, images }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                First image will be the main product image
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function StatusRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
