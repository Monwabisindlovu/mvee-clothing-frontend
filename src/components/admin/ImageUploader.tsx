'use client';

import { useRef, useState } from 'react';
import { X, ImagePlus, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { ProductImage } from '@/types/product';

interface ImageUploaderProps {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  uploadFile?: (file: File) => Promise<string>; // optional: for real backend upload
}

export default function ImageUploader({ value, onChange, uploadFile }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const filesArray = Array.from(files);
    setUploading(true);

    try {
      const uploaded: ProductImage[] = [];

      for (const file of filesArray) {
        let url: string;

        if (uploadFile) {
          // Use your backend uploader if provided
          url = await uploadFile(file);
        } else {
          // Fallback: temporary preview
          url = URL.createObjectURL(file);
        }

        uploaded.push({
          id: crypto.randomUUID(),
          url,
          alt: file.name,
        });
      }

      onChange([...value, ...uploaded]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (id: string) => {
    onChange(value.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Product Images</h3>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ImagePlus className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Add images'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={e => handleFiles(e.target.files)}
      />

      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No images uploaded
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((img, index) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-lg border"
            >
              <img src={img.url} alt={img.alt ?? ''} className="h-full w-full object-cover" />

              {index === 0 && (
                <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                  Main
                </span>
              )}

              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-2 top-2 hidden rounded-full bg-black/70 p-1 text-white group-hover:block"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
