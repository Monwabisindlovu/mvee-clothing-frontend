'use client';

import React, { ReactNode } from 'react';
import { Home, Box, ShoppingCart, Star, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Products', href: '/admin/products', icon: Box },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Customers', href: '/admin/customers', icon: Users },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="px-6 py-4 font-bold text-lg border-b">Admin Dashboard</div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={classNames(
                    'flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-100 transition-colors',
                    { 'bg-neutral-100 font-semibold': active }
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t mt-auto">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-600">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        </header>

        <motion.div
          className="max-w-7xl mx-auto px-6 py-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
