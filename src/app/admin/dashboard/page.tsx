'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  Plus,
  ArrowRight,
  LayoutDashboard,
  Store,
} from 'lucide-react';

import { base44 } from '@/api/base44Client';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

/* -------------------------------------------------------------------------- */
/*                                Color Map                                   */
/* -------------------------------------------------------------------------- */

const statColors = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
  },
};

export default function AdminDashboardPage() {
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list('-created_date', 100),
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 50),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => base44.entities.Review.list('-created_date', 20),
  });

  const stats = {
    totalProducts: products.length,
    inStockProducts: products.filter(p => p.in_stock).length,
    featuredProducts: products.filter(p => p.is_featured).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total ?? 0), 0),
    avgRating:
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 'N/A',
  };

  const recentOrders = orders.slice(0, 5);
  const recentProducts = products.slice(0, 5);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LayoutDashboard className="w-6 h-6" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Store className="w-4 h-4 mr-2" />
                  View Store
                </Button>
              </Link>

              <Link href="/admin/products/create">
                <Button size="sm" className="bg-black hover:bg-neutral-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Products',
              value: stats.totalProducts,
              icon: Package,
              color: 'blue',
            },
            {
              label: 'Total Orders',
              value: stats.totalOrders,
              sub: stats.pendingOrders ? `${stats.pendingOrders} pending` : null,
              icon: ShoppingCart,
              color: 'green',
            },
            {
              label: 'Revenue',
              value: `R${stats.totalRevenue.toFixed(0)}`,
              icon: DollarSign,
              color: 'purple',
            },
            {
              label: 'Avg Rating',
              value: stats.avgRating,
              icon: Star,
              color: 'yellow',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            const colors = statColors[item.color as keyof typeof statColors];

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-500 mb-1">{item.label}</p>
                        <p className="text-3xl font-bold">{item.value}</p>
                        {item.sub && <p className="text-xs text-orange-600 mt-1">{item.sub}</p>}
                      </div>

                      <div className={`p-3 rounded-xl ${colors.bg}`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Orders & Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-neutral-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{order.customer_name}</p>
                        <p className="text-xs text-neutral-500">
                          {order.items?.length ?? 0} items •{' '}
                          {format(new Date(order.created_date), 'MMM d, HH:mm')}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-sm">R{order.total?.toFixed(2)}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 capitalize">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Products</CardTitle>
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              {recentProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-500 mb-4">No products yet</p>
                  <Link href="/admin/products/create">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Product
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentProducts.map(product => (
                    <Link
                      key={product.id}
                      href={`/admin/products/${product.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden">
                        <img
                          src={
                            product.images?.[0] ??
                            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100'
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-neutral-500 capitalize">{product.category}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-sm">R{product.price?.toFixed(2)}</p>
                        <div className="flex gap-1 justify-end">
                          {product.is_featured && (
                            <span className="text-xs bg-black text-white px-1.5 py-0.5 rounded">
                              NEW
                            </span>
                          )}
                          {!product.in_stock && (
                            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                              OUT
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
