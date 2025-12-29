'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  /** ✅ Stable derived values */
  const images = useMemo(
    () => (product.images?.length ? product.images : [product.image || '/placeholder.png']),
    [product.images, product.image]
  );

  const colors = product.colors || [];
  const subcategory = product.subcategory || '';
  const featured = product.featured || false;
  const inStock = product.isActive ?? true;

  const mainImage = images[selectedImage];

  /** ✅ Auto-rotate images on hover */
  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage(prev => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isHovered, images]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full max-w-[220px] md:max-w-[200px] lg:max-w-[180px]"
    >
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all bg-white">
        {/* IMAGE */}
        <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name || 'Unnamed Product'}
            fill
            sizes="(max-width: 768px) 100vw, 200px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-medium tracking-wide">Out of Stock</span>
            </div>
          )}

          {featured && inStock && (
            <Badge className="absolute top-3 left-3 bg-black text-white border-0 text-xs tracking-wider">
              FEATURED
            </Badge>
          )}

          {/* HOVER ACTIONS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
          >
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => onQuickView?.(product)}>
                Quick View
              </Button>

              {inStock && (
                <Button
                  size="sm"
                  className="flex-1 bg-black hover:bg-black/80 text-white text-xs"
                  onClick={() => onAddToCart?.(product)}
                >
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                  Add to Cart
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* INFO */}
        <div className="p-3 space-y-1">
          <h3 className="font-medium text-stone-900 line-clamp-1 text-sm">{product.name}</h3>

          <span className="font-semibold text-stone-900 text-sm">R{product.price.toFixed(2)}</span>

          <p className="text-xs text-stone-500 capitalize">{subcategory || product.category}</p>

          {colors.length > 0 && (
            <div className="flex gap-1 pt-1">
              {colors.slice(0, 5).map((color, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-stone-200 shadow-sm"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}

              {colors.length > 5 && (
                <span className="text-xs text-stone-400 ml-1">+{colors.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
