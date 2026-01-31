// src/utils/whatsapp.ts

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface OrderDetails {
  orderRef: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  deliveryFee: number;
  total: number;
}

/**
 * Builds a professional WhatsApp order message
 * (returns TEXT, not a URL)
 */
export const createWhatsAppOrder = (items: CartItem[], details: OrderDetails): string => {
  const itemsText = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}
   Qty: ${item.quantity}
   Price: R${(item.price * item.quantity).toFixed(2)}
   ${item.size ? `Size: ${item.size}` : ''}
   ${item.color ? `Color: ${item.color}` : ''}`
    )
    .join('\n\n');

  return `
🛒 *NEW ORDER RECEIVED*
—————————————
*Order Ref:* ${details.orderRef}

*Customer Details*
Name: ${details.customer.name}
Phone: ${details.customer.phone}
Address: ${details.customer.address}
${details.customer.notes ? `Notes: ${details.customer.notes}` : ''}

—————————————
*Items*
${itemsText}

—————————————
Delivery: ${details.deliveryFee === 0 ? 'FREE' : `R${details.deliveryFee}`}
*Total: R${details.total.toFixed(2)}*

Please confirm this order.
`.trim();
};

/**
 * Generates WhatsApp link
 */
export const generateWhatsAppLink = (phone: string, message: string): string => {
  const normalizedPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
};
