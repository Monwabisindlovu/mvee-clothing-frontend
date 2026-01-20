'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
// ✅ default import

import { createPageUrl } from '@/utils/index';
import type { Product } from '@/types/product';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images ?? [];

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    } as any);
    onClose();
  };

  const nextImage = () => setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  const prevImage = () => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2
                       md:-translate-x-1/2 md:-translate-y-1/2
                       md:w-full md:max-w-4xl md:max-h-[90vh]
                       bg-white rounded-2xl z-50 overflow-hidden
                       flex flex-col md:flex-row"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full shadow"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Images */}
            <div className="relative w-full md:w-1/2 bg-neutral-100">
              <img
                src={
                  images[currentImageIndex]?.url ||
                  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 p-6 md:p-8 overflow-auto">
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                {product.category} • {product.category}
              </p>

              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold">R{product.price.toFixed(2)}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-neutral-400 line-through">
                    R{product.original_price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral-600 mb-6">{product.description}</p>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Size</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm ${
                          selectedSize === size ? 'bg-black text-white' : 'hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color.name ? 'border-black' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6 flex items-center gap-4">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <Minus />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>
                  <Plus />
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  ADD TO CART
                </Button>

                <Link href={`/shop/${product.slug}`}>
                  <Button variant="outline" className="w-full" onClick={onClose}>
                    VIEW FULL DETAILS
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
