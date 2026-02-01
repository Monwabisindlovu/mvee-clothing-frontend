'use client';

import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem } = useCartContext();
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const handleCheckout = () => {
    onClose();
    setTimeout(() => {
      router.push('/checkout');
    }, 200); // matches drawer animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  <h2 className="font-bold text-lg">Your Cart ({items.length})</h2>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-neutral-300 mb-4" />
                    <p className="text-neutral-500 mb-4">Your cart is empty</p>
                    <Button variant="outline" onClick={onClose}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-4">
                        {/* Image */}
                        {item.image && (
                          <div className="w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden relative">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                          <p className="text-xs text-neutral-500 mt-1">
                            {item.size && `Size: ${item.size}`}
                            {item.color && ` • ${item.color}`}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity */}
                            <div className="flex items-center border rounded-full">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))
                                }
                                className="p-2 hover:bg-neutral-100 rounded-full"
                              >
                                <Minus className="w-3 h-3" />
                              </button>

                              <span className="px-3 text-sm">{item.quantity}</span>

                              <button
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                className="p-2 hover:bg-neutral-100 rounded-full"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-neutral-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-bold">R{total.toFixed(2)}</span>
                  </div>

                  <Button className="w-full bg-black text-white h-12" onClick={handleCheckout}>
                    CHECKOUT
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
