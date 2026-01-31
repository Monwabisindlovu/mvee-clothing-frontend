'use client';

import { useState } from 'react';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRESET_COLORS } from '@/lib/constants';

export interface ColorValue {
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  value: ColorValue[];
  onChange: (colors: ColorValue[]) => void;
}

const PREVIEW_COUNT = 8; // how many colors to show before expand

export default function ColorSelector({ value, onChange }: ColorSelectorProps) {
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#000000');
  const [expanded, setExpanded] = useState(false);

  /* ---------------------------- HELPERS ---------------------------- */
  const exists = (hex: string) => value.some(c => c.hex.toLowerCase() === hex.toLowerCase());

  const addColor = (color: ColorValue) => {
    if (exists(color.hex)) return;
    onChange([...value, color]);
  };

  const addCustomColor = () => {
    const trimmed = name.trim();
    if (!trimmed || exists(hex)) return;

    addColor({ name: trimmed, hex });
    setName('');
    setHex('#000000');
  };

  const removeColor = (hex: string) => {
    onChange(value.filter(c => c.hex !== hex));
  };

  const visibleColors = expanded ? PRESET_COLORS : PRESET_COLORS.slice(0, PREVIEW_COUNT);

  /* ---------------------------- RENDER ---------------------------- */
  return (
    <div className="space-y-4">
      {/* Preset colors dropdown */}
      <div className="border rounded-lg p-3 bg-white">
        <button
          type="button"
          onClick={() => setExpanded(p => !p)}
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          Preset colors
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <div className="mt-3 flex flex-wrap gap-2">
          {visibleColors.map(color => {
            const selected = exists(color.hex);

            return (
              <button
                key={color.hex}
                type="button"
                title={color.name}
                onClick={() => addColor(color)}
                disabled={selected}
                className={`relative h-6 w-6 rounded-full border transition
                  ${selected ? 'ring-2 ring-primary cursor-not-allowed' : 'hover:scale-110'}
                `}
                style={{ backgroundColor: color.hex }}
              >
                {selected && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!expanded && PRESET_COLORS.length > PREVIEW_COUNT && (
          <p className="mt-2 text-xs text-muted-foreground">
            + {PRESET_COLORS.length - PREVIEW_COUNT} more colors
          </p>
        )}
      </div>

      {/* Custom color */}
      <div className="border rounded-lg p-3 bg-white">
        <p className="text-sm font-medium mb-2">Custom color</p>

        <div className="flex flex-wrap gap-2 items-end">
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Color name (e.g. Midnight Blue)"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            type="color"
            className="h-10 w-12 border rounded"
            value={hex}
            onChange={e => setHex(e.target.value)}
          />

          <Button type="button" onClick={addCustomColor}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Selected colors */}
      <div>
        <p className="text-sm font-medium mb-2">Selected colors</p>

        <div className="flex flex-wrap gap-2">
          {value.map(color => (
            <span
              key={color.hex}
              className="flex items-center gap-2 px-3 py-1 border rounded bg-white"
            >
              <span
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: color.hex }}
              />
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
            <span className="text-sm text-neutral-500">No colors selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
