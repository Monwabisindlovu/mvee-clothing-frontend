import React, { Suspense } from 'react';
import ShopClient from './ShopClient';

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-neutral-100 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
          <p className="text-neutral-600">Discover our products</p>
        </div>
      </section>

      {/* Client-side filtering, search, grid toggle, QuickView */}
      <Suspense fallback={<p className="text-center py-20 text-neutral-500">Loading shop…</p>}>
        <ShopClient />
      </Suspense>
    </main>
  );
}
