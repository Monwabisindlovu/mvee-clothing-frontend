import type { Product } from '@/types/product';

export interface CartItem {
  id: string; // unique cart item id
  productId: string; // flat product id for duplicate checks
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  product: Product; // keep full product object for details
}
