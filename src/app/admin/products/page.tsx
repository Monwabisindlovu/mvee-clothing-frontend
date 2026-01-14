'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'sonner';

import { base44 } from '@/api/base44Client';

import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list('-created_date', 200),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await base44.request('DELETE', `/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await base44.request('PATCH', `/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated');
    },
  });

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button>
                <ArrowLeft className="w-4 h-4" />
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

          <Select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </Select>
        </div>

        {/* Products Table */}
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
                  <th className="p-3">Stock</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3">Sale</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredProducts.map((product: any) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-t"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0]}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <Badge>{product.category}</Badge>
                      </td>

                      <td className="p-3 text-center">R{product.price}</td>

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={product.in_stock}
                          onChange={() =>
                            updateMutation.mutate({
                              id: product.id,
                              data: { in_stock: !product.in_stock },
                            })
                          }
                        />
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={product.is_featured}
                          onChange={() =>
                            updateMutation.mutate({
                              id: product.id,
                              data: { is_featured: !product.is_featured },
                            })
                          }
                        />
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={product.is_on_promotion}
                          onChange={() =>
                            updateMutation.mutate({
                              id: product.id,
                              data: { is_on_promotion: !product.is_on_promotion },
                            })
                          }
                        />
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <Button>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>

                          <Button
                            onClick={() => {
                              if (confirm(`Delete ${product.name}?`)) {
                                deleteMutation.mutate(product.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
