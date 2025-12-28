// src/types/product.ts

export type ProductCategory = 'men' | 'women' | 'kids';

export type Product = {
  description: any;
  subcategory: string;
  featured: any;
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  images: string[];
  category: ProductCategory;
  sizes: string[];
  colors: string[];
  stock: number;
  isActive: boolean;
  in_stock?: boolean;
};
