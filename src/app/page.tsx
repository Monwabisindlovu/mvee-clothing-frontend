'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Truck, Shield, RefreshCw, Star } from 'lucide-react';

import FeaturedCarousel from '@/components/store/FeaturedCarousel';
import CategoryBanner from '@/components/store/CategoryBanner';
import ProductCard from '@/components/store/ProductCard';
import QuickViewModal from '@/components/store/QuickViewModal';
import { Button } from '@/components/ui/button';
import Hero from '@/components/store/HeroSection';

import { ProductService } from '@/services/product.service';
import type { Product } from '@/types/product';

import { useCartContext } from '@/context/CartContext';

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addItem } = useCartContext();

  /* ------------------ Products ------------------ */
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: ProductService.getAll,
  });

  const featuredProducts = products.filter(p => p.is_featured);
  const promotionProducts = products.filter(p => p.is_on_promotion);

  const avgRating = '5.0';

  /* ------------------ Add to Cart Helper ------------------ */
  const handleAddToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    quantity: number = 1
  ) => {
    addItem({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  const handleProductAdd = (product: Product) => {
    if ((product.sizes?.length || 0) > 1 || (product.colors?.length || 0) > 1) {
      setQuickViewProduct(product);
      return;
    }
    handleAddToCart(product, product.sizes?.[0], product.colors?.[0]?.name, 1);
  };

  return (
    <main>
      <Hero />

      {/* Feature strip */}
      <section className="bg-black text-white py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Feature icon={<Truck />} label="FREE DELIVERY R500+" />
          <Feature icon={<Shield />} label="PAY ON DELIVERY" />
          <Feature icon={<RefreshCw />} label="EASY RETURNS" />
          <Feature icon={<Star />} label={`${avgRating} RATING`} />
        </div>
      </section>

      {/* Featured */}
      {featuredProducts.length > 0 && (
        <FeaturedCarousel
          title="New Arrivals"
          subtitle="JUST DROPPED"
          products={featuredProducts}
          onQuickView={setQuickViewProduct}
          onAddToCart={handleProductAdd}
        />
      )}

      {/* ✅ CategoryBanner is purely navigational */}
      <CategoryBanner />

      {/* Promotions */}
      {promotionProducts.length > 0 && (
        <FeaturedCarousel
          title="On Sale"
          subtitle="LIMITED TIME OFFERS"
          products={promotionProducts}
          onQuickView={setQuickViewProduct}
          onAddToCart={handleProductAdd}
        />
      )}

      {/* Popular products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard
                key={product.id ?? index}
                product={product}
                onQuickView={setQuickViewProduct}
                onAddToCart={handleProductAdd}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button className="px-12 py-4 tracking-widest">VIEW ALL PRODUCTS</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* QuickView Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={p => {
          handleAddToCart(p, p.selectedSize, p.selectedColor, p.quantity);
          setQuickViewProduct(null);
        }}
      />
    </main>
  );
}

/* ------------------ Helper ------------------ */
function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6">{icon}</div>
      <span className="text-xs tracking-wide">{label}</span>
    </div>
  );
}
