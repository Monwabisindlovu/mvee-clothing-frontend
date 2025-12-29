'use client';

import useCart from '@/hooks/useCart';

export default function CartSummary() {
  const { total } = useCart();

  return (
    <div className="mt-6 border-t pt-4">
      <p className="text-lg font-semibold">Total: R{total}</p>
    </div>
  );
}
