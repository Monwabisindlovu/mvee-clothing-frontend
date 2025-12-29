export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  images: string[];
  category: 'men' | 'women' | 'kids';
  subcategory: string;
  description: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  isActive: boolean;
};
