'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ColorValue {
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  value: ColorValue[];
  onChange: (colors: ColorValue[]) => void;
}

export default function ColorSelector({ value, onChange }: ColorSelectorProps) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#000000');

  const addColor = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    if (value.some(c => c.hex === hex)) return;

    onChange([...value, { name: trimmedName, hex }]);
    setName('');
    setHex('#000000');
  };

  const removeColor = (hex: string) => {
    onChange(value.filter(c => c.hex !== hex));
  };

  return (
    <div className="space-y-3">
      {/* Add color */}
      <div className="flex flex-wrap gap-2 items-end">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Color name (e.g. Black)"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="color"
          className="h-10 w-12 border rounded"
          value={hex}
          onChange={e => setHex(e.target.value)}
        />

        <Button type="button" onClick={addColor}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Selected colors */}
      <div className="flex flex-wrap gap-2">
        {value.map(color => (
          <span
            key={color.hex}
            className="flex items-center gap-2 px-3 py-1 border rounded bg-white"
          >
            <span className="w-4 h-4 rounded" style={{ backgroundColor: color.hex }} />
            {color.name}
            <button
              type="button"
              onClick={() => removeColor(color.hex)}
              className="text-neutral-500 hover:text-black"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        {value.length === 0 && (
          <span className="text-sm text-neutral-500">No colors added yet</span>
        )}
      </div>
    </div>
  );
}
