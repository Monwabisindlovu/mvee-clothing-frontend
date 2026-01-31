'use client';

import { useRef, useState, useEffect } from 'react';
import { X, ImagePlus, GripVertical } from 'lucide-react';
import type { ProductImage } from '@/types/product';

interface ImageUploaderProps {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    return () => {
      Object.values(previews).forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  /* ---------------------------- GET SIGNATURE ---------------------------- */
  const getSignature = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/upload/signature', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      if (!res.ok) throw new Error('Failed to get signature');
      return await res.json();
    } catch (err) {
      console.error('Failed to get signature', err);
      throw err;
    }
  };

  /* ---------------------------- UPLOAD FILE ---------------------------- */
  const uploadFile = async (file: File, onProgress?: (p: number) => void): Promise<string> => {
    const { timestamp, signature, apiKey, cloudName } = await getSignature();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', apiKey);
    formData.append('folder', 'products');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
    return data.secure_url as string;
  };

  /* ---------------------------- HANDLE FILES ---------------------------- */
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    setUploading(true);
    const uploadedImages: ProductImage[] = [];

    try {
      for (const file of Array.from(files)) {
        const id = crypto.randomUUID();
        const previewUrl = URL.createObjectURL(file);

        setPreviews(p => ({ ...p, [id]: previewUrl }));
        setProgress(p => ({ ...p, [id]: 0 }));

        try {
          const realUrl = await uploadFile(file, p => setProgress(prev => ({ ...prev, [id]: p })));
          uploadedImages.push({ id, url: realUrl, alt: file.name });
        } catch (err) {
          console.error('Image upload failed', err);
        } finally {
          URL.revokeObjectURL(previewUrl);
          setPreviews(p => {
            const copy = { ...p };
            delete copy[id];
            return copy;
          });
          setProgress(p => {
            const copy = { ...p };
            delete copy[id];
            return copy;
          });
        }
      }

      if (uploadedImages.length > 0) {
        onChange([...value, ...uploadedImages]);
      }
    } finally {
      setUploading(false);
    }
  };

  /* ---------------------------- DRAG & DROP ---------------------------- */
  const onDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const onDrop = (index: number) => {
    if (dragIndex.current === null) return;
    const updated = [...value];
    const [moved] = updated.splice(dragIndex.current, 1);
    updated.splice(index, 0, moved);
    dragIndex.current = null;
    onChange(updated);
  };

  /* ---------------------------- ACTIONS ---------------------------- */
  const removeImage = (id: string) => {
    if (previews[id]) URL.revokeObjectURL(previews[id]);
    setPreviews(p => {
      const copy = { ...p };
      delete copy[id];
      return copy;
    });
    onChange(value.filter(img => img.id !== id));
  };

  const setMainImage = (index: number) => {
    if (index === 0) return;
    const reordered = [...value];
    const [main] = reordered.splice(index, 1);
    reordered.unshift(main);
    onChange(reordered);
  };

  /* ---------------------------- RENDER ---------------------------- */
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Product Images</h3>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-sm text-primary hover:underline disabled:opacity-50"
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
        <div
          className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground"
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
        >
          Drag & drop images here
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(index)}
              className="group relative aspect-square rounded-lg border overflow-hidden"
            >
              <img src={img.url} alt={img.alt ?? ''} className="h-full w-full object-cover" />

              {index === 0 && (
                <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                  Main
                </span>
              )}

              {progress[img.id] !== undefined && progress[img.id] < 100 && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-black/30">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress[img.id]}%` }}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-2 top-2 hidden rounded-full bg-black/70 p-1 text-white group-hover:block"
              >
                <X className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setMainImage(index)}
                className="absolute left-2 bottom-2 hidden rounded bg-black/70 px-2 py-1 text-xs text-white group-hover:block"
              >
                Set main
              </button>

              <GripVertical className="absolute right-2 bottom-2 h-4 w-4 text-white/70 hidden group-hover:block" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
