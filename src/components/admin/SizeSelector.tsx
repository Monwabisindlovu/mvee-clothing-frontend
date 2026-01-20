'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SizeSelectorProps {
  value: string[];
  onChange: (sizes: string[]) => void;
}

export default function SizeSelector({ value, onChange }: SizeSelectorProps) {
  const [input, setInput] = useState('');

  const addSize = () => {
    const size = input.trim();
    if (!size) return;
    if (value.includes(size)) return;

    onChange([...value, size]);
    setInput('');
  };

  const removeSize = (size: string) => {
    onChange(value.filter(s => s !== size));
  };

  return (
    <div className="space-y-3">
      {/* Add size */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Add size (e.g. S, M, 42, One Size)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSize()}
        />
        <Button type="button" onClick={addSize}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Selected sizes */}
      <div className="flex flex-wrap gap-2">
        {value.map(size => (
          <span key={size} className="flex items-center gap-2 px-3 py-1 rounded border bg-white">
            {size}
            <button
              type="button"
              onClick={() => removeSize(size)}
              className="text-neutral-500 hover:text-black"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        {value.length === 0 && <span className="text-sm text-neutral-500">No sizes added yet</span>}
      </div>
    </div>
  );
}
