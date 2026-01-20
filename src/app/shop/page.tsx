'use client';

import { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import ProductCard from '@/components/store/ProductCard';
import CartDrawer from '@/components/store/CartDrawer';
import QuickViewModal from '@/components/store/QuickViewModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { SlidersHorizontal, Search, X, Grid3X3, LayoutGrid } from 'lucide-react';

export default function Shop() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('mvee_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  const [filters, setFilters] = useState({
    category: initialCategory,
    subcategory: 'all',
    search: '',
    priceRange: [0, 5000],
    inStock: false,
    sortBy: 'newest',
  });
  const [gridCols, setGridCols] = useState(4);

  useEffect(() => {
    localStorage.setItem('mvee_cart', JSON.stringify(cart));
  }, [cart]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-created_date', 100),
  });

  const subcategories = [
    'shoes',
    'sneakers',
    't-shirts',
    'jeans',
    'dresses',
    'jackets',
    'hoodies',
    'shorts',
    'accessories',
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.subcategory !== 'all') {
      result = result.filter(p => p.subcategory === filters.subcategory);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        p => p.name?.toLowerCase().includes(search) || p.description?.toLowerCase().includes(search)
      );
    }
    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    if (filters.inStock) {
      result = result.filter(p => p.in_stock);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        // newest - already sorted by created_date
        break;
    }

    return result;
  }, [products, filters]);

  const addToCart = (item: any) => {
    const cartItem = item.product_id
      ? item
      : {
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: 1,
          size: item.sizes?.[0] || '',
          color: item.colors?.[0]?.name || '',
          image: item.images?.[0],
        };
    setCart(prev => [...prev, cartItem]);
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map((item, i) => (i === index ? { ...item, quantity } : item)));
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      subcategory: 'all',
      search: '',
      priceRange: [0, 5000],
      inStock: false,
      sortBy: 'newest',
    });
  };

  const categoryTitle =
    filters.category !== 'all'
      ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
      : 'All Products';

  return (
    <>
      <Header cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-neutral-100 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{categoryTitle}</h1>
            <p className="text-neutral-600">{filteredProducts.length} products</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select
                value={filters.sortBy}
                onValueChange={v => setFilters(f => ({ ...f, sortBy: v }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <FilterPanel
                    filters={filters}
                    setFilters={setFilters}
                    subcategories={subcategories}
                  />
                </SheetContent>
              </Sheet>

              {/* Grid Toggle */}
              <div className="hidden md:flex items-center border rounded-lg">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 ${gridCols === 3 ? 'bg-neutral-100' : ''}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 ${gridCols === 4 ? 'bg-neutral-100' : ''}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-32">
                <FilterPanel
                  filters={filters}
                  setFilters={setFilters}
                  subcategories={subcategories}
                />
                {(filters.category !== 'all' ||
                  filters.subcategory !== 'all' ||
                  filters.inStock ||
                  filters.search) && (
                  <Button variant="ghost" onClick={clearFilters} className="w-full mt-4 text-sm">
                    <X className="w-4 h-4 mr-2" />
                    Clear all filters
                  </Button>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className={`grid grid-cols-2 md:grid-cols-${gridCols} gap-4 md:gap-6`}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-neutral-200 rounded-lg mb-4" />
                      <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2" />
                      <div className="h-4 bg-neutral-200 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-neutral-200 rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-neutral-500 mb-4">No products found</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                <motion.div
                  layout
                  className={`grid grid-cols-2 md:grid-cols-${gridCols} gap-4 md:gap-6`}
                >
                  <AnimatePresence>
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={setQuickViewProduct}
                        onAddToCart={() => addToCart(product)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
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

function FilterPanel({ filters, setFilters, subcategories }) {
  return (
    <div className="space-y-8">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-sm mb-4 tracking-wide">CATEGORY</h3>
        <div className="space-y-3">
          {['all', 'men', 'women', 'kids'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilters(f => ({ ...f, category: cat }))}
              className={`block text-sm capitalize transition-colors ${
                filters.category === cat
                  ? 'font-medium text-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory */}
      <div>
        <h3 className="font-semibold text-sm mb-4 tracking-wide">TYPE</h3>
        <div className="space-y-3">
          <button
            onClick={() => setFilters(f => ({ ...f, subcategory: 'all' }))}
            className={`block text-sm transition-colors ${
              filters.subcategory === 'all'
                ? 'font-medium text-black'
                : 'text-neutral-500 hover:text-black'
            }`}
          >
            All Types
          </button>
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setFilters(f => ({ ...f, subcategory: sub }))}
              className={`block text-sm capitalize transition-colors ${
                filters.subcategory === sub
                  ? 'font-medium text-black'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              {sub.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-sm mb-4 tracking-wide">PRICE RANGE</h3>
        <Slider
          value={filters.priceRange}
          onValueChange={v => setFilters(f => ({ ...f, priceRange: v }))}
          max={5000}
          step={100}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-neutral-500">
          <span>R{filters.priceRange[0]}</span>
          <span>R{filters.priceRange[1]}</span>
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="inStock"
          checked={filters.inStock}
          onCheckedChange={c => setFilters(f => ({ ...f, inStock: c }))}
        />
        <label htmlFor="inStock" className="text-sm">
          In Stock Only
        </label>
      </div>
    </div>
  );
}
