'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { CategoryService } from '@/services/category.service';
import type { Category } from '@/types/category';

export default function CategoriesPage() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  /* ---------------------------- FETCH CATEGORIES ---------------------------- */
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: CategoryService.getAll,
  });

  /* ----------------------------- ADD CATEGORY ----------------------------- */
  const addMutation = useMutation({
    mutationFn: (name: string) => CategoryService.create({ name }),
    onSuccess: () => {
      toast.success('Category added');
      setName('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      toast.error('Failed to add category');
    },
  });

  /* ---------------------------- DELETE CATEGORY ---------------------------- */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoryService.delete(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      toast.error('Failed to delete category');
    },
  });

  /* ------------------------------- HANDLERS ------------------------------- */
  const handleAddCategory = () => {
    if (!name.trim()) return;
    addMutation.mutate(name.trim());
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  /* --------------------------------- UI --------------------------------- */
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">Categories</h1>

      <div className="flex gap-2">
        <Input placeholder="New category" value={name} onChange={e => setName(e.target.value)} />
        <Button onClick={handleAddCategory} disabled={addMutation.isPending}>
          Add
        </Button>
      </div>

      {isLoading ? (
        <p>Loading categories…</p>
      ) : categories.length === 0 ? (
        <p>No categories found</p>
      ) : (
        <ul className="space-y-2">
          {categories.map(cat => (
            <li
              key={cat.id}
              className="flex items-center justify-between rounded-lg border bg-white px-4 py-2"
            >
              <span className="capitalize">{cat.name}</span>

              <Button
                size="icon"
                variant="ghost"
                className="text-red-500 hover:text-red-600"
                onClick={() => handleDeleteCategory(cat.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
