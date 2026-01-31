//c/hooks/useCart.ts

import { useCartContext } from '@/context/CartContext';

export default function useCart() {
  return useCartContext();
}
