'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';

import {
  ArrowLeft,
  Search,
  Eye,
  ShoppingCart,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  MessageSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/modal';

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  product_name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  notes?: string;
  status: OrderStatus;
  created_date: string;
  total: number;
  items: OrderItem[];
}

/* -------------------------------------------------------------------------- */
/* MOCK API (replace later with real service) */
/* -------------------------------------------------------------------------- */

async function fetchOrders(): Promise<Order[]> {
  return [];
}

async function updateOrderStatus(id: string, status: OrderStatus) {
  return { id, status };
}

/* -------------------------------------------------------------------------- */
/* STATUS CONFIG */
/* -------------------------------------------------------------------------- */

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-100 text-blue-700',
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-700',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
};

/* -------------------------------------------------------------------------- */
/* PAGE */
/* -------------------------------------------------------------------------- */

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchOrders,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order updated');
    },
  });

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        !search ||
        order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        order.phone.includes(search);

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h1 className="text-xl font-bold">Orders</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="p-4 mb-6 flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full border rounded-md pl-10 py-2"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setStatusFilter(e.target.value as any)
            }
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All statuses</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </Card>

        {/* Orders */}
        {isLoading ? (
          <div className="text-center py-12">Loading…</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">No orders found</div>
        ) : (
          <AnimatePresence>
            {filteredOrders.map(order => {
              const statusCfg = STATUS_CONFIG[order.status];
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl p-6 mb-4 shadow-sm"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{order.customer_name}</h3>
                        <Badge className={statusCfg.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusCfg.label}
                        </Badge>
                      </div>

                      <p className="text-sm text-neutral-500 flex gap-2">
                        <Phone className="w-4 h-4" />
                        {order.phone}
                      </p>

                      <p className="text-sm text-neutral-500 flex gap-2">
                        <Clock className="w-4 h-4" />
                        {format(new Date(order.created_date), 'PPpp')}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold">R{order.total.toFixed(2)}</p>
                      <Button onClick={() => setSelectedOrder(order)} className="mt-2">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <select
                      value={order.status}
                      onChange={e =>
                        updateMutation.mutate({
                          id: order.id,
                          status: e.target.value as OrderStatus,
                        })
                      }
                      className="border rounded-md px-3 py-2"
                    >
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <option key={key} value={key}>
                          {cfg.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </main>

      {/* Modal */}
      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Order Details</h2>
            <p>
              <strong>Name:</strong> {selectedOrder.customer_name}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.phone}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
