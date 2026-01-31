'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product, ProductImage } from '@/types/product';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
  onClose?: () => void;
}

export default function ShopProductPage({ params, onClose }: PageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiFetch<Product>(`/api/products/slug/${params.slug}`);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  // BACK BUTTON: respects QuickView history state
  const handleBack = () => {
    if (window.history.state?.fromQuickView) {
      router.back();
    } else {
      router.push('/shop');
    }
  };

  return (
    <>
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        Back
      </button>
      <ProductPage product={product} onClose={onClose} />
    </>
  );
}

/* ----------------------- PRODUCT PAGE ----------------------- */
function ProductPage({ product, onClose }: { product: Product; onClose?: () => void }) {
  const images: ProductImage[] = product.images ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState({ scale: 1, offsetX: 0, offsetY: 0 });
  const [zoomActive, setZoomActive] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  if (!images || images.length === 0) return <p>No images available</p>;

  const openLightbox = (index: number) => {
    setLightboxOpen(true);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom({ scale: 1, offsetX: 0, offsetY: 0 });
    setZoomActive(false);
    onClose?.(); // go back to QuickView if applicable
  };

  const prevImage = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  const nextImage = () => setCurrentIndex(prev => (prev + 1) % images.length);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen]);

  /* Touch pinch */
  const touchState = useRef({ startDist: 0, startScale: 1 });
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
  const handleTouchEnd = () => (touchState.current.startDist = 0);

  return (
    <>
      {/* ================= Main Image Section ================= */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          {/* Main Image */}
          <div
            onClick={() => openLightbox(currentIndex)}
            className="relative overflow-hidden rounded-xl border cursor-zoom-in"
            style={{ aspectRatio: '4/5' }}
          >
            <img
              ref={imgRef}
              src={images[currentIndex].url}
              alt={images[currentIndex].alt ?? product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Thumbnails */}
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
                  <img
                    src={img.url}
                    alt={img.alt ?? product.name}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= Product Info ================= */}
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
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

      {/* ================= LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-white text-3xl z-50"
            >
              <X />
            </button>

            <button onClick={prevImage} className="absolute left-5 text-white text-4xl z-50">
              <ChevronLeft />
            </button>
            <button onClick={nextImage} className="absolute right-5 text-white text-4xl z-50">
              <ChevronRight />
            </button>

            <div
              className="max-w-[90%] max-h-[90%] relative cursor-zoom-in"
              onClick={() => setZoomActive(prev => !prev)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.img
                key={currentIndex}
                src={images[currentIndex].url}
                alt={images[currentIndex].alt ?? product.name}
                initial={{ scale: 0.9 }}
                animate={{ scale: zoomActive ? 2 : zoom.scale }}
                exit={{ scale: 0.9 }}
                style={{
                  transform: `scale(${zoomActive ? 2 : zoom.scale}) translate(${zoom.offsetX}px, ${zoom.offsetY}px)`,
                  cursor: zoomActive ? 'zoom-out' : 'zoom-in',
                }}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
