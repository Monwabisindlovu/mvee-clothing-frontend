'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function Header({ cartCount = 0, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'Men', href: '/shop?category=men' },
    { name: 'Women', href: '/shop?category=women' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="md:hidden p-2 -ml-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="MVEE Logo"
                width={120}
                height={40}
                priority
                style={{ objectFit: 'contain' }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium tracking-wide hover:text-neutral-500 transition-colors relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="text-sm font-medium tracking-wide hover:text-neutral-500 transition-colors relative group"
                >
                  {cat.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
                </Link>
              ))}
              <Link
                href="/shop"
                className="text-sm font-medium tracking-wide hover:text-neutral-500 transition-colors relative group"
              >
                All Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Admin Icon */}
              {isAdmin ? (
                <button
                  onClick={logout}
                  className="p-2 rounded hover:bg-neutral-100 transition-colors"
                  title="Logout Admin"
                >
                  <Shield className="w-5 h-5 text-green-600" />
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  className="p-2 rounded hover:bg-neutral-100 transition-colors"
                  title="Admin Login"
                >
                  <Shield className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => onCartClick?.()}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-32 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl font-bold tracking-tight hover:text-neutral-500 transition-colors"
              >
                Home
              </Link>
              {categories.map(cat => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-bold tracking-tight hover:text-neutral-500 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="text-3xl font-bold tracking-tight hover:text-neutral-500 transition-colors"
              >
                All Products
              </Link>

              {/* Mobile Admin */}
              <Link
                href={isAdmin ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-semibold mt-6"
              >
                {isAdmin ? 'Admin Dashboard' : 'Admin Login'}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content behind header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
