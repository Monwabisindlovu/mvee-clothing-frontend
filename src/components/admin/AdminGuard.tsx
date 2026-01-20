'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role !== 'admin') {
      router.push('/');
    }
  }, [role, router]);

  if (role !== 'admin') return null;

  return <>{children}</>;
}
