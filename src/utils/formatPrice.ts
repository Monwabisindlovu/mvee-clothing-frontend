// src/utils/formatPrice.ts

export function formatPrice(amount: number): string {
  return `R${amount.toFixed(2)}`;
}
