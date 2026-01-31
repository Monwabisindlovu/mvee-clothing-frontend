'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { CategoryService } from '@/services/category.service';
import type { Category } from '@/types/category';

export default function CategoriesPage() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: CategoryService.getAll,
  });

  // Add category
  const addMutation = useMutation({
    mutationFn: (name: string) => CategoryService.create({ name }),
    onSuccess: () => {
      toast.success('Category added');
      setName('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Delete category
  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoryService.delete(id),
    onSuccess: () => {
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleAddCategory = () => {
    if (!name.trim()) return;
    addMutation.mutate(name);
  };

  const handleRemoveCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">Categories</h1>

      <div className="flex gap-2">
        <Input placeholder="New category" value={name} onChange={e => setName(e.target.value)} />
        <Button onClick={handleAddCategory}>Add</Button>
      </div>

      {isLoading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found</p>
      ) : (
        <ul className="space-y-2">
          {categories.map(cat => (
            <li
              key={cat.id}
              className="flex items-center justify-between bg-white border rounded-lg px-4 py-2"
            >
              <span className="capitalize">{cat.name}</span>
              <Button
                size="icon"
                variant="ghost"
                className="text-red-500"
                onClick={() => handleRemoveCategory(cat.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
