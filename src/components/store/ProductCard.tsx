'use client';

import React, { useState } from 'react';
import { Eye, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (
    product: Product & {
      quantity: number;
      selectedSize?: string;
      selectedColor?: string;
    }
  ) => void;
}

export default function ProductCard({ product, onQuickView, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round((1 - product.price / product.original_price) * 100)
      : 0;

  const images = product.images ?? [];

  /* ------------------ Add to Cart / QuickView ------------------ */
  const handleAction = () => {
    if ((product.sizes?.length || 0) > 1 || (product.colors?.length || 0) > 1) {
      onQuickView?.(product);
      return;
    }

    onAddToCart?.({
      ...product,
      quantity: 1,
      selectedSize: product.sizes?.[0],
      selectedColor: product.colors?.[0]?.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <div className="relative aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-4">
        {/* Product Image */}
        <div className="relative w-full h-full cursor-pointer" onClick={handleAction}>
          <Image
            src={
              images[currentImageIndex]?.url ||
              images[0]?.url ||
              'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_on_promotion && discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          {product.is_featured && (
            <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
          )}
          {product.in_stock === false && (
            <span className="bg-neutral-500 text-white text-xs font-bold px-2 py-1 rounded">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Hover Quick Action Button */}
        {product.in_stock !== false && (
          <motion.button
            onClick={handleAction}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white hover:bg-black hover:text-white text-black p-3 rounded-full transition-all shadow-lg"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        )}

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 4).map((_, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setCurrentImageIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentImageIndex === idx ? 'bg-black w-4' : 'bg-white/80 w-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          {product.category} • {product.subcategory}
        </p>

        <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-2">
          <span className="font-bold">R{product.price.toFixed(2)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-neutral-400 line-through text-sm">
              R{product.original_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Colors Preview */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 5).map(color => (
              <span
                key={color.name}
                className="w-4 h-4 rounded-full border border-neutral-200"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-neutral-400 ml-1">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Explicit Add to Cart Button */}
        {product.in_stock !== false && (
          <button
            onClick={handleAction}
            className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-neutral-800 text-sm flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </motion.div>
  );
}
