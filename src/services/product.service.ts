import type { Product } from '@/types/product';

/**
 * MOCK PRODUCT DATA
 * Replace this with API calls later
 */
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MVEE Classic Hoodie',
    slug: 'mvee-classic-hoodie',
    description: 'Premium heavyweight hoodie with a relaxed street fit.',
    price: 899,
    original_price: 1099,

    images: [
      { id: '1', url: '/images/products/hoodie-black-1.jpg' },
      { id: '2', url: '/images/products/hoodie-black-2.jpg' },
    ],

    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#9CA3AF' },
    ],

    category: 'hoodies',
    stock: 24,

    is_featured: true,
    is_on_promotion: true,

    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'MVEE Signature Tee',
    slug: 'mvee-signature-tee',
    description: 'Soft-touch cotton t-shirt with minimal branding.',
    price: 399,

    images: [{ id: '1', url: '/images/products/tee-white-1.jpg' }],

    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
    ],

    category: 't-shirts',
    stock: 50,

    is_featured: true,
    is_on_promotion: false,

    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'MVEE Cargo Pants',
    slug: 'mvee-cargo-pants',
    description: 'Utility-inspired cargo pants with modern tailoring.',
    price: 799,

    images: [{ id: '1', url: '/images/products/cargo-olive-1.jpg' }],

    sizes: ['28', '30', '32', '34'],
    colors: [{ name: 'Olive', hex: '#556B2F' }],

    category: 'pants',
    stock: 18,

    is_featured: false,
    is_on_promotion: true,

    created_at: new Date().toISOString(),
  },
];

/**
 * Product Service
 */
class ProductService {
  create: MutationFunction<unknown, void> | undefined;
  update(arg0: string, data: any): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  async getAll(): Promise<Product[]> {
    return Promise.resolve(mockProducts);
  }

  async getFeatured(): Promise<Product[]> {
    return Promise.resolve(mockProducts.filter(product => product.is_featured));
  }

  async getPromotions(): Promise<Product[]> {
    return Promise.resolve(mockProducts.filter(product => product.is_on_promotion));
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return Promise.resolve(mockProducts.find(product => product.slug === slug) ?? null);
  }

  async getById(id: string): Promise<Product | null> {
    return Promise.resolve(mockProducts.find(product => product.id === id) ?? null);
  }

  async getByCategory(category: string): Promise<Product[]> {
    return Promise.resolve(mockProducts.filter(product => product.category === category));
  }
}

/**
 * Export a singleton
 */
export const productService = new ProductService();
