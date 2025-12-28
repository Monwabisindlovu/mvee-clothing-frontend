import { CartItem } from '@/types/cart';
import { STORE_SETTINGS } from './constants';

type CustomerInfo = {
  name: string;
  phone: string;
  location: string;
  notes?: string;
};

export function buildWhatsAppMessage(items: CartItem[], total: number, customer: CustomerInfo) {
  const lines = items.map(
    (item, i) =>
      `${i + 1}. ${item.name}
Size: ${item.size}
Color: ${item.color}
Qty: ${item.quantity}
Price: R${item.price}`
  );

  return encodeURIComponent(`
Hello, I would like to place an order:

${lines.join('\n\n')}

Total: R${total}

Customer Name: ${customer.name}
Contact Number: ${customer.phone}
Delivery Location: ${customer.location}
Notes: ${customer.notes || 'N/A'}

Payment Method: Cash on Delivery
`);
}

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${STORE_SETTINGS.whatsappNumber}?text=${message}`;
}
