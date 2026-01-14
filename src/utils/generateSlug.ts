// src/utils/generateSlug.ts
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
