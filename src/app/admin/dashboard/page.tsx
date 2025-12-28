import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage products, stock, and store settings.</p>
      </div>
    </AdminGuard>
  );
}
