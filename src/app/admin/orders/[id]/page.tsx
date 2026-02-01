'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button size="icon" variant="ghost">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Order Details</h1>
        </div>

        {/* Content */}
        <Card className="p-6 space-y-3">
          <p>
            <strong>Order ID:</strong> {params.id}
          </p>

          <p className="text-sm text-neutral-500">Order details will be loaded here.</p>
        </Card>
      </div>
    </div>
  );
}
