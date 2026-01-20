import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function AdminLogout() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        logout();
        router.push('/');
      }}
      className="flex items-center gap-2 text-sm text-red-600"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}
