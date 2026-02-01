'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/types/product';

interface FeaturedCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (
    product: Product & { quantity: number; selectedSize?: string; selectedColor?: string }
  ) => void;
}

export default function FeaturedCarousel({
  products,
  title,
  subtitle,
  onQuickView,
  onAddToCart,
}: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!products?.length) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          {subtitle && <p className="text-xs tracking-[0.3em] text-neutral-500 mb-2">{subtitle}</p>}

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>

          {/* Controls */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => scroll('left')}
              className="p-3 border border-neutral-200 hover:border-black rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 border border-neutral-200 hover:border-black rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <div
              key={product.id || product.slug || index}
              className="flex-shrink-0 w-64 md:w-72 snap-start"
            >
              <ProductCard product={product} onQuickView={onQuickView} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
