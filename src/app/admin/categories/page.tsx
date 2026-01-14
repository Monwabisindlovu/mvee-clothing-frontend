'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('-created_date'),
  });

  const addCategory = async () => {
    if (!name.trim()) return;
    await base44.entities.Category.create({ name });
    setName('');
    queryClient.invalidateQueries(['categories']);
  };

  const removeCategory = async (id: string) => {
    await base44.entities.Category.delete(id);
    queryClient.invalidateQueries(['categories']);
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">Categories</h1>

      <div className="flex gap-2">
        <Input placeholder="New category" value={name} onChange={e => setName(e.target.value)} />
        <Button onClick={addCategory}>Add</Button>
      </div>

      <ul className="space-y-2">
        {categories.map((cat: any) => (
          <li
            key={cat.id}
            className="flex items-center justify-between bg-white border rounded-lg px-4 py-2"
          >
            <span className="capitalize">{cat.name}</span>
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500"
              onClick={() => removeCategory(cat.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
