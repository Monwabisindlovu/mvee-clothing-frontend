'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/store/ProductCard';
import QuickViewModal from '@/components/store/QuickViewModal';
import { useCartContext } from '@/context/CartContext';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { SlidersHorizontal, Grid3X3, LayoutGrid, Search } from 'lucide-react';

import { fetchProducts } from '@/services/product.service';
import type { Product } from '@/types/product';

export default function ShopClient() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'all';

  const { addItem } = useCartContext();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [filters, setFilters] = useState<Filters>({
    category: categoryFromUrl,
    subcategory: 'all',
    search: '',
    priceRange: [0, 5000],
    inStock: false,
    sortBy: 'newest',
  });

  useEffect(() => {
    setFilters(f => ({ ...f, category: categoryFromUrl, subcategory: 'all' }));
  }, [categoryFromUrl]);

  const [gridCols, setGridCols] = useState(4);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const subcategories = [
    'men-suits',
    'men-blazers',
    'men-formal-shirts',
    'men-trousers',
    'men-waistcoats',
    'men-formal-shoes',
    'men-ties',
    'women-suits',
    'women-blazers',
    'women-dresses',
    'women-formal-shirts',
    'women-blouses',
    'women-skirts',
    'women-trousers',
    'women-heels',
    'women-handbags',
    'women-formal-shoes',
    'accessories',
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (filters.category !== 'all') result = result.filter(p => p.category === filters.category);
    if (filters.subcategory !== 'all')
      result = result.filter(p => p.subcategory === filters.subcategory);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }
    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    if (filters.inStock) result = result.filter(p => p.in_stock);

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
    }

    return result;
  }, [products, filters]);

  const clearFilters = () => {
    setFilters({
      category: categoryFromUrl, // preserve URL category
      subcategory: 'all',
      search: '',
      priceRange: [0, 5000],
      inStock: false,
      sortBy: 'newest',
    });
  };

  const handleAddToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    quantity: number = 1
  ) => {
    addItem({ ...product, quantity, selectedSize, selectedColor });
  };

  const handleProductAdd = (product: Product) => {
    if ((product.sizes?.length || 0) > 1 || (product.colors?.length || 0) > 1) {
      setQuickViewProduct(product);
      return;
    }
    handleAddToCart(product, product.sizes?.[0], product.colors?.[0]?.name);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b">
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
          <Select
            value={filters.sortBy}
            onValueChange={v => setFilters(f => ({ ...f, sortBy: v }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low → High</SelectItem>
              <SelectItem value="price-high">Price: High → Low</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
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

      {isLoading ? (
        <p className="text-center py-20 text-neutral-500">Loading products…</p>
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
          className={`grid grid-cols-2 gap-4 md:gap-6 ${gridCols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}
        >
          <AnimatePresence>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id} // stable key
                product={product}
                onQuickView={setQuickViewProduct}
                onAddToCart={handleProductAdd}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={p => handleAddToCart(p, p.selectedSize, p.selectedColor)}
      />
    </div>
  );
}

/** Types */
interface Filters {
  category: string;
  subcategory: string;
  search: string;
  priceRange: number[];
  inStock: boolean;
  sortBy: string;
}

interface FilterPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  subcategories: string[];
}

function FilterPanel({ filters, setFilters, subcategories }: FilterPanelProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-sm mb-4">CATEGORY</h3>
        {['all', 'men', 'women'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilters(f => ({ ...f, category: cat }))}
            className={`block text-sm capitalize ${filters.category === cat ? 'font-medium text-black' : 'text-neutral-500'}`}
          >
            {cat === 'all' ? 'All Products' : cat}
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-4">TYPE</h3>
        {subcategories.map(sub => (
          <button
            key={sub}
            onClick={() => setFilters(f => ({ ...f, subcategory: sub }))}
            className={`block text-sm capitalize ${filters.subcategory === sub ? 'font-medium text-black' : 'text-neutral-500'}`}
          >
            {sub.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-4">PRICE RANGE</h3>
        <Slider
          value={filters.priceRange}
          onValueChange={v => setFilters(f => ({ ...f, priceRange: v }))}
          max={5000}
          step={100}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={filters.inStock}
          onChange={e => setFilters(f => ({ ...f, inStock: e.target.checked }))}
        />
        <span className="text-sm">In Stock Only</span>
      </div>
    </div>
  );
}
