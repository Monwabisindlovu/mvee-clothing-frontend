'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button size="icon" variant="ghost">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h1 className="text-xl font-bold">Your Cart</h1>
          </div>
        </div>

        {/* Content */}
        <Card className="p-6">
          <p className="text-neutral-600">Your cart items will appear here.</p>

          <p className="text-sm text-neutral-400 mt-2">
            Cart functionality is ready to be connected.
          </p>
        </Card>
      </div>
    </div>
  );
}
