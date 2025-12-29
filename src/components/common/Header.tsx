'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/common/Button';
import useCart from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { STORE_NAME, CATEGORIES } from '@/lib/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Image
                src="/logo.png"
                alt={`${STORE_NAME} logo`}
                width={75}
                height={20}
                priority
                className="object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className="text-white font-medium hover:text-blue-400 transition-colors duration-200"
            >
              Shop All
            </Link>
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="text-white font-medium hover:text-blue-400 transition-colors duration-200"
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && isAdmin() && (
              <Link href="/admin/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex text-white hover:text-blue-400"
                >
                  <User className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-blue-400"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-blue-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4">
            <nav className="flex flex-col gap-2">
              <Link
                href="/shop"
                className="px-4 py-3 text-blue-400 hover:text-white transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop All
              </Link>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.id}`}
                  className="px-4 py-3 text-blue-400 hover:text-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}

              {isAuthenticated && isAdmin() && (
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-3 flex items-center gap-2 text-blue-400 hover:text-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Admin Portal
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
