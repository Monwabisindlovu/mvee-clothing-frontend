'use client';

import { CartItem as Item } from '@/types/cart';
import useCart from '@/hooks/useCart';

export default function CartItem({ item }: { item: Item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex justify-between border-b py-3">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-500">
          {item.size} · {item.color}
        </p>
        <p>R{item.price}</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={e => updateQuantity(item.id, Number(e.target.value))} // ✅ use item.id
          className="w-16 border px-2"
        />
        <button onClick={() => removeItem(item.id)} className="text-red-500">
          {' '}
          {/* ✅ use item.id */}
          Remove
        </button>
      </div>
    </div>
  );
}
