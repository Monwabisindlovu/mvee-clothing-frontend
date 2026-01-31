'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import type { CartItem } from '@/types/cart';
import type { Product } from '@/types/product';

interface CartContextValue {
  items: CartItem[];
  addItem: (
    product: Product & {
      quantity: number;
      selectedSize?: string;
      selectedColor?: string;
    }
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  hydrating: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrating, setHydrating] = useState(true);

  /* ---------------------- Hydrate from localStorage ---------------------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mvee_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setHydrating(false);
    }
  }, []);

  /* ---------------------- Persist to localStorage ------------------------ */
  useEffect(() => {
    if (!hydrating) {
      localStorage.setItem('mvee_cart', JSON.stringify(items));
    }
  }, [items, hydrating]);

  /* --------------------------- Add Item --------------------------------- */
  const addItem = (
    product: Product & {
      quantity: number;
      selectedSize?: string;
      selectedColor?: string;
    }
  ) => {
    let updatedExisting = false;

    setItems(prev => {
      const index = prev.findIndex(
        i =>
          i.productId === product.id &&
          i.size === product.selectedSize &&
          i.color === product.selectedColor
      );

      if (index > -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + product.quantity,
        };
        updatedExisting = true;
        return updated;
      }

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          productId: product.id, // ✅ flat id for duplicate checks
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          size: product.selectedSize,
          color: product.selectedColor,
          image: product.images?.[0]?.url,
          product, // ✅ keep full product object
        },
      ];
    });

    // 🔔 Toast AFTER state update
    if (updatedExisting) {
      toast.success(
        `Updated ${product.name} (${product.selectedSize || 'No size'} • ${
          product.selectedColor || 'No color'
        })`
      );
    } else {
      toast.success(
        `Added ${product.name} (${product.selectedSize || 'No size'} • ${
          product.selectedColor || 'No color'
        })`
      );
    }
  };

  /* -------------------------- Remove Item -------------------------------- */
  const removeItem = (id: string) => {
    let removedItem: CartItem | undefined;

    setItems(prev => {
      removedItem = prev.find(i => i.id === id);
      return prev.filter(i => i.id !== id);
    });

    if (removedItem) {
      toast.info(
        `Removed ${removedItem.name} (${removedItem.size || 'No size'} • ${
          removedItem.color || 'No color'
        })`
      );
    }
  };

  /* ------------------------ Update Quantity ------------------------------ */
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  /* --------------------------- Clear Cart -------------------------------- */
  const clearCart = () => {
    setItems([]);
    toast.info('Cart cleared');
  };

  /* ---------------------------- Total ----------------------------------- */
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        hydrating,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* --------------------------- Hook ---------------------------------------- */
export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used inside CartProvider');
  }
  return ctx;
};
