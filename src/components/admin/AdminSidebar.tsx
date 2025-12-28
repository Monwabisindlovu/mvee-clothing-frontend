'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-3">
        <a href="/admin/dashboard">Dashboard</a>
        <a href="/admin/products">Products</a>
        <a href="/admin/categories">Categories</a>
        <a href="/admin/settings">Settings</a>

        <button onClick={logout} className="mt-6 text-red-600">
          Logout
        </button>
      </nav>
    </aside>
  );
}
