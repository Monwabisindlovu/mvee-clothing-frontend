// app/layout.tsx
'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import './globals.css';

import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider, useCartContext } from '@/context/CartContext';

import Header from '@/components/store/Header';
import CartDrawer from '@/components/store/CartDrawer';
import Footer from '@/components/store/Footer';
import { Toaster } from 'sonner';

function LayoutContent({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Only use CartContext here AFTER provider is mounted
  const { items } = useCartContext();

  return (
    <>
      <Header cartCount={items.length} onCartClick={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      {children}
      <Footer />
      <Toaster richColors position="top-right" />
    </>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            {/* ✅ CartProvider now wraps LayoutContent, not GlobalLayout */}
            <CartProvider>
              <LayoutContent>{children}</LayoutContent>
            </CartProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
