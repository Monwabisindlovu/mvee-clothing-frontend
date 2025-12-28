// src/lib/constants.ts

// Store branding
export const STORE_NAME = 'MVEE Clothing';

// Product categories (used on Home, Shop, Filters)
export const CATEGORIES = [
  {
    id: 'men',
    label: 'Men',
    image: '/mencategory.jpg',
  },
  {
    id: 'women',
    label: 'Women',
    image: '/women.png',
  },
  {
    id: 'kids',
    label: 'Kids',
    image: '/kidscategory.png',
  },
];

// Available sizes
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

// Available colors
export const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Grey', 'Brown'] as const;

// Store settings
export const STORE_SETTINGS = {
  whatsappNumber: '27712345678', // replace later via admin
  currency: 'ZAR',
};
