'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import Button from '@/components/ui/Button';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, MessageCircle, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('mvee_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    localStorage.setItem('mvee_cart', JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const deliveryFee = total >= 500 ? 0 : 50;
  const grandTotal = total + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.customer_name || !form.phone || !form.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Build WhatsApp message
    let message = `🛍️ *New Order from MVEE Clothing*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${form.customer_name}\n`;
    message += `Phone: ${form.phone}\n`;
    message += `Address: ${form.address}\n`;
    if (form.notes) message += `Notes: ${form.notes}\n`;
    message += `\n*Order Items:*\n`;

    cart.forEach((item: any, idx: number) => {
      message += `${idx + 1}. ${item.product_name}`;
      if (item.size) message += ` (Size: ${item.size})`;
      if (item.color) message += ` (Color: ${item.color})`;
      message += ` x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Subtotal:* R${total.toFixed(2)}\n`;
    message += `*Delivery:* ${deliveryFee === 0 ? 'FREE' : `R${deliveryFee.toFixed(2)}`}\n`;
    message += `*Total:* R${grandTotal.toFixed(2)}\n`;
    message += `\n💳 *Payment:* Pay on Delivery`;

    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '27XXXXXXXXX'; // Replace with actual number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    setCart([]);
    localStorage.removeItem('mvee_cart');
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <>
        <Header cartCount={0} />
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 md:p-12 max-w-md text-center shadow-lg"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Order Sent!</h1>
            <p className="text-neutral-600 mb-8">
              Your order has been sent via WhatsApp. We'll confirm your order and arrange delivery
              shortly.
            </p>
            <Link href="/">
              <Button className="bg-black hover:bg-neutral-800 text-white px-8">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header cartCount={cart.length} />
      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm text-neutral-500 hover:text-black mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 mb-6">Your cart is empty</p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Form */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={form.customer_name}
                      onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. 0712345678"
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">
                      Delivery Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="Enter your full delivery address"
                      className="mt-1.5"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Any special instructions..."
                      className="mt-1.5"
                      rows={2}
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-sm tracking-wide font-semibold"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Place Order via WhatsApp
                    </Button>
                    <p className="text-xs text-neutral-500 text-center mt-3">
                      Your order will be sent to our WhatsApp for confirmation
                    </p>
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    {cart.map((item: any, index: number) => (
                      <motion.div key={`${item.product_id}-${index}`} layout className="flex gap-4">
                        <div className="w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={
                              item.image ||
                              'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'
                            }
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2">{item.product_name}</h3>
                          <p className="text-xs text-neutral-500 mt-1">
                            {item.size && `Size: ${item.size}`} {item.color && `• ${item.color}`}
                          </p>
                          <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                          <p className="font-semibold mt-1">
                            R{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="p-2 text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Subtotal</span>
                      <span>R{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Delivery</span>
                      <span>{deliveryFee === 0 ? 'FREE' : `R${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <p className="text-xs text-neutral-400">Free delivery on orders over R500</p>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-3 border-t">
                      <span>Total</span>
                      <span>R{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-100 rounded-xl p-4 mt-4">
                  <p className="text-sm text-neutral-600 text-center">
                    💳 <strong>Pay on Delivery</strong> - No online payment required
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
