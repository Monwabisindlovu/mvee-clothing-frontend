'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { useCartContext } from '@/context/CartContext';
import { createWhatsAppOrder, generateWhatsAppLink } from '@/utils/whatsapp';
import { generateOrderRef } from '@/utils/orderRef';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, clearCart, isLoading } = useCartContext();

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const deliveryFee = total >= 500 ? 0 : 50;
  const grandTotal = total + deliveryFee;

  useEffect(() => {
    if (isLoading) {
      toast.loading('Loading your cart…');
    } else {
      toast.dismiss();
    }
  }, [isLoading]);

  const handleSubmit = () => {
    if (submitting) return;

    if (!form.name || !form.phone || !form.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^\+?\d{9,15}$/.test(form.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (form.address.trim().length < 10) {
      toast.error('Please enter a full delivery address');
      return;
    }

    if (!items.length) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);

    const orderRef = generateOrderRef();

    const message = createWhatsAppOrder(items, {
      orderRef,
      customer: form,
      deliveryFee,
      total: grandTotal,
    });

    const whatsappUrl = generateWhatsAppLink(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!, message);

    window.open(whatsappUrl, '_blank');
    clearCart();

    // Reset submitting after redirect
    setTimeout(() => {
      router.push('/');
      setSubmitting(false);
    }, 500);
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <p className="text-center py-20">Loading your cart…</p>;
  }

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 mb-6">Your cart is empty</p>
          <Button onClick={() => router.push('/shop')}>Start Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => router.push('/shop')}
          className="flex items-center text-sm text-neutral-500 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>
            <div className="space-y-5">
              <div>
                <Label>Full Name *</Label>
                <Input
                  autoFocus
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <Label>Phone Number *</Label>
                <Input
                  placeholder="e.g. 071 234 5678"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <div>
                <Label>Delivery Address *</Label>
                <Textarea
                  placeholder="Street, suburb, city, postal code"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label>Additional Notes (Optional)</Label>
                <Textarea
                  placeholder="Any special delivery instructions…"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-14"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Opening WhatsApp…
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Place Order via WhatsApp
                  </>
                )}
              </Button>

              <div className="text-xs text-neutral-500 text-center">
                Order reference will be generated when you place the order.
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  {item.image && (
                    <div className="w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.size && `Size: ${item.size}`} {item.color && `• ${item.color}`}
                    </p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                    <p className="font-semibold">
                      R{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>

                  <button onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4 text-neutral-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>R{total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : `R${deliveryFee}`}</span>
              </div>

              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span>R{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
