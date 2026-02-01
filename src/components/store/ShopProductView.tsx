'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { Product, ProductImage } from '@/types/product';

export default function ShopProductView({ product }: { product: Product }) {
  const images: ProductImage[] = product.images ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState({ scale: 1, offsetX: 0, offsetY: 0 });
  const [zoomActive, setZoomActive] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchState = useRef({ startDist: 0, startScale: 1 });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.border = '2px solid red';
    }
  }, []);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom({ scale: 1, offsetX: 0, offsetY: 0 });
    setZoomActive(false);
  };

  const prevImage = useCallback(
    () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length),
    [images.length]
  );

  const nextImage = useCallback(
    () => setCurrentIndex(prev => (prev + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, prevImage, nextImage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchState.current.startDist = dist;
      touchState.current.startScale = zoom.scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.min(
        Math.max((dist / touchState.current.startDist) * touchState.current.startScale, 1),
        3
      );
      setZoom(prev => ({ ...prev, scale: newScale }));
    }
  };

  const handleTouchEnd = () => {
    touchState.current.startDist = 0;
  };

  // ✅ Render fallback inside JSX, not before hooks
  if (images.length === 0) {
    return <p>No images available</p>;
  }

  return (
    <div ref={containerRef}>
      {/* ================= MAIN IMAGE ================= */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div
            onClick={() => openLightbox(currentIndex)}
            className="relative overflow-hidden rounded-xl border cursor-zoom-in"
            style={{ aspectRatio: '4 / 5' }}
          >
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt ?? product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative aspect-square rounded-lg overflow-hidden border ${
                    currentIndex === idx ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    fill
                    className="object-contain"
                    sizes="25vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= PRODUCT INFO ================= */}
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category}
            {product.subcategory ? ` • ${product.subcategory}` : ''}
          </p>

          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">R{product.price.toFixed(2)}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="line-through text-muted-foreground">
                R{product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground">{product.description}</p>
          )}
        </div>
      </div>

      {/* ================= LIGHTBOX ================= */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          >
            <button onClick={closeLightbox} className="absolute top-5 right-5 text-white text-3xl">
              <X />
            </button>

            <button onClick={prevImage} className="absolute left-5 text-white text-4xl">
              <ChevronLeft />
            </button>

            <button onClick={nextImage} className="absolute right-5 text-white text-4xl">
              <ChevronRight />
            </button>

            <div
              className="max-w-[90%] max-h-[90%] cursor-zoom-in relative"
              onClick={() => setZoomActive(v => !v)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                key={currentIndex}
                initial={{ scale: 0.9 }}
                animate={{ scale: zoomActive ? 2 : zoom.scale }}
                exit={{ scale: 0.9 }}
                className="w-full h-full"
              >
                <Image
                  src={images[currentIndex].url}
                  alt={images[currentIndex].alt ?? product.name}
                  fill
                  className="object-contain rounded-lg"
                  sizes="90vw"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
