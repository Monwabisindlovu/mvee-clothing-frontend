'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, ArrowLeft, Package, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

import { ProductService } from '@/services/product.service';
import type { Product } from '@/types/product';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const queryClient = useQueryClient();

  /* ----------------------------- FETCH PRODUCTS ----------------------------- */
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: () => ProductService.getAll(),
  });

  /* ------------------------------ DELETE PRODUCT ----------------------------- */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  /* ------------------------------ UPDATE PRODUCT ----------------------------- */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      ProductService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated');
    },
    onError: () => {
      toast.error('Failed to update product');
    },
  });

  /* --------------------------------- FILTER -------------------------------- */
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <h1 className="text-xl font-bold">Products</h1>
            </div>
          </div>

          <Link href="/admin/products/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="kids">Kids</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">Loading products…</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="text-neutral-500 mb-4">No products found</p>
              <Link href="/admin/products/create">
                <Button>Add First Product</Button>
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Featured</th>
                  <th className="p-3 text-center">Sale</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => {
                  const categoryLabel =
                    product.category === 'men'
                      ? 'Men'
                      : product.category === 'women'
                        ? 'Women'
                        : product.category === 'kids'
                          ? product.subcategory === 'boys'
                            ? 'Boys'
                            : product.subcategory === 'girls'
                              ? 'Girls'
                              : 'Kids'
                          : product.category;

                  return (
                    <tr
                      key={product._id}
                      className="border-t hover:bg-neutral-50 transition-colors"
                    >
                      {/* Product */}
                      <td className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                            {product.images?.[0]?.url && (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-neutral-500 line-clamp-2">
                              {product.description || 'No description'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3 text-center">
                        <Badge variant="outline">{categoryLabel}</Badge>
                      </td>

                      {/* Price */}
                      <td className="p-3 text-center">
                        <p className="font-medium">R{product.price.toFixed(2)}</p>
                        {product.original_price && product.original_price > product.price && (
                          <p className="text-xs text-neutral-400 line-through">
                            R{product.original_price.toFixed(2)}
                          </p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="p-3 text-center">
                        <Switch
                          checked={product.in_stock}
                          onCheckedChange={() =>
                            updateMutation.mutate({
                              id: product._id,
                              data: { in_stock: !product.in_stock },
                            })
                          }
                        />
                      </td>

                      {/* Featured */}
                      <td className="p-3 text-center">
                        <Switch
                          checked={product.is_featured}
                          onCheckedChange={() =>
                            updateMutation.mutate({
                              id: product._id,
                              data: { is_featured: !product.is_featured },
                            })
                          }
                        />
                      </td>

                      {/* Sale */}
                      <td className="p-3 text-center">
                        <Switch
                          checked={product.is_on_promotion}
                          onCheckedChange={() =>
                            updateMutation.mutate({
                              id: product._id,
                              data: { is_on_promotion: !product.is_on_promotion },
                            })
                          }
                        />
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          {/* Public view */}
                          <Link href={`/shop/${product.slug}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>

                          {/* Edit */}
                          <Link href={`/admin/products/${product._id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => {
                              if (confirm(`Delete ${product.name}?`)) {
                                deleteMutation.mutate(product._id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-sm text-neutral-500 mt-4 text-center">
          {filteredProducts.length} of {products.length} products
        </p>
      </main>
    </div>
  );
}
