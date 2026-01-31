// src/utils/generateSlug.ts
export default function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

export function createPageUrl(page: string): string {
  switch (page) {
    case 'ProductDetail':
      return '/product';
    case 'Shop':
      return '/shop';
    case 'Cart':
      return '/cart';
    default:
      return '/';
  }
}
