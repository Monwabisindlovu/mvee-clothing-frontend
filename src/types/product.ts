import { Key, ReactNode } from 'react';

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  is_main?: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  short_description: string;
  subcategory: ReactNode;
  _id: Key | null | undefined;
  id: string;

  name: string;
  slug: string;
  description?: string;

  category: string;
  type: string;

  price: number;
  original_price?: number | null;

  images: ProductImage[];
  sizes: string[];
  colors: ProductColor[];

  stock?: number;
  in_stock: boolean;

  is_featured: boolean;
  is_on_promotion: boolean;

  created_at: string;
}
