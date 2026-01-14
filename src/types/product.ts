export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;

  price: number;
  original_price?: number | null; // allow null to match form usage

  images: ProductImage[]; // structured images
  sizes: string[];
  colors: ProductColor[];

  category: string;
  subcategory?: string; // optional, since your form references it

  stock: number;
  in_stock: boolean;

  is_featured: boolean;
  is_on_promotion: boolean;

  created_at: string;
}
