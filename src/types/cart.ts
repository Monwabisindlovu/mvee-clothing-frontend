export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  getCartCount: () => number;
};
