'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Star } from 'lucide-react';

import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

import FeaturedCarousel from '@/components/store/FeaturedCarousel';
import CategoryBanner from '@/components/store/CategoryBanner';
import ProductCard from '@/components/store/ProductCard';
import CartDrawer from '@/components/store/CartDrawer';
import QuickViewModal from '@/components/store/QuickViewModal';
import { Button } from '@/components/ui/button';
import Hero from '@/components/store/HeroSection';

import { productService } from '@/services/product.service';
import type { Product } from '@/types/product';

export default function HomePage() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  /* ------------------ Cart persistence ------------------ */
  useEffect(() => {
    const saved = localStorage.getItem('mvee_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('mvee_cart', JSON.stringify(cart));
  }, [cart]);

  /* ------------------ Products ------------------ */
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  const featuredProducts = products.filter(p => p.is_featured);
  const promotionProducts = products.filter(p => p.is_on_promotion);

  /* ------------------ Cart actions ------------------ */
  const addToCart = (product: Product) => {
    setCart(prev => [
      ...prev,
      {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: 1,
        size: product.sizes?.[0] ?? '',
        color: product.colors?.[0]?.name ?? '',
        image: product.images?.[0]?.url ?? '',
      },
    ]);
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map((item, i) => (i === index ? { ...item, quantity } : item)));
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const avgRating = '5.0';

  return (
    <>
      <Header cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />

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
            onAddToCart={addToCart}
          />
        )}

        <CategoryBanner />

        {/* Promotions */}
        {promotionProducts.length > 0 && (
          <FeaturedCarousel
            title="On Sale"
            subtitle="LIMITED TIME OFFERS"
            products={promotionProducts}
            onQuickView={setQuickViewProduct}
            onAddToCart={addToCart}
          />
        )}

        {/* Popular products */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Items</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 8).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  onAddToCart={() => addToCart(product)}
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
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />
    </>
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
