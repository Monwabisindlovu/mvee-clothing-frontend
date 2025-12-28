'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { buildWhatsAppMessage, getWhatsAppUrl } from '@/lib/whatsapp';

export default function CartPage() {
  const { items, total } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const sendOrder = () => {
    const message = buildWhatsAppMessage(items, total, {
      name,
      phone,
      location,
      notes,
    });
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {items.map((item, index) => (
        <CartItem key={index} item={item} index={index} />
      ))}

      <CartSummary />

      <div className="mt-6 space-y-3">
        <input
          placeholder="Your name"
          className="w-full border p-2"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          placeholder="Phone number"
          className="w-full border p-2"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <input
          placeholder="Delivery location"
          className="w-full border p-2"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <textarea
          placeholder="Notes (optional)"
          className="w-full border p-2"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <button onClick={sendOrder} className="w-full bg-green-600 text-white py-3 rounded">
          Send Order via WhatsApp
        </button>
      </div>
    </div>
  );
}
