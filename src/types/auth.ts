// src/types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'customer' | 'admin';
}
