'use client';

import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { STORE_NAME, CATEGORIES } from '@/lib/constants';

export default function HomePage() {
  const { products, isLoading } = useProducts({ featured: true });

  return (
    <div className="bg-stone-50">
      {/* ================= HERO ================= */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30 z-10" />

        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600"
          alt="Fashion store hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{STORE_NAME}</h1>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Premium fashion for men, women, and kids. Pay on delivery.
          </p>

          <Link
            href="/shop"
            className="inline-block px-10 py-3 bg-white text-stone-900 rounded-full font-medium hover:bg-stone-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl font-semibold mb-10">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map(category => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative h-80 overflow-hidden rounded-xl"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.label}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Text */}
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-semibold mb-1">{category.label}</h3>
                <span className="text-sm underline underline-offset-4">Shop {category.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Featured Products</h2>

          <Link href="/shop" className="text-sm font-medium text-stone-700 hover:text-stone-900">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-stone-500">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-stone-500">No featured products</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
