'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import { useProducts } from '@/hooks/useProducts';
import useCart from '@/hooks/useCart';

import { Button } from '@/components/common/Button';
import { ShoppingBag } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { products, isLoading } = useProducts();
  const { addItem } = useCart();

  const product = useMemo(() => products.find(p => p.slug === slug), [products, slug]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return <div className="py-20 text-center text-stone-500">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-stone-500 mb-4">Product not found</p>
        <Button onClick={() => router.push('/shop')}>Back to shop</Button>
      </div>
    );
  }

  const images =
    product.images?.length > 0 ? product.images : [product.image || '/placeholder.png'];

  const isOutOfStock = !product.isActive;

  const canAddToCart =
    !isOutOfStock &&
    (!product.sizes?.length || selectedSize) &&
    (!product.colors?.length || selectedColor);

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      slug: product.slug,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE GALLERY */}
        <div>
          <div className="relative aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              priority
              className="object-contain p-6 transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* THUMBNAILS */}
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setSelectedImage(idx)}
                  className={`relative aspect-square bg-stone-100 rounded-lg overflow-hidden border ${
                    selectedImage === idx ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-contain p-2 transition-transform duration-300 hover:scale-110"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT INFO */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-stone-900">{product.name}</h1>
            <p className="text-xl font-semibold mt-2">R{product.price.toFixed(2)}</p>
          </div>

          {product.description && (
            <p className="text-stone-600 leading-relaxed">{product.description}</p>
          )}

          {/* COLOR SELECTOR */}
          {product.colors?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-black' : 'border-stone-300'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          {product.sizes?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-sm border rounded-md ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-stone-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div>
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 border rounded-md"
              >
                −
              </button>
              <span className="min-w-[24px] text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 border rounded-md">
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART */}
          <Button
            disabled={!canAddToCart}
            onClick={handleAddToCart}
            className="w-full h-12 text-sm"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {isOutOfStock ? 'Out of Stock' : canAddToCart ? 'Add to Cart' : 'Select options'}
          </Button>
        </div>
      </div>
    </div>
  );
}
