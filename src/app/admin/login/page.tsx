'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/context/AuthContext';
import { X, Eye, EyeOff } from 'lucide-react';

interface UserResponse {
  id: string;
  role: 'admin' | 'user';
  name: string;
  email: string;
}

interface LoginResponse {
  token?: string;
  user?: UserResponse;
  message?: string; // optional backend error message
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAsAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.token || !data.user) {
        throw new Error(data.message || 'Login failed');
      }

      // Ensure user object matches AuthContext's User type
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name || 'Admin', // fallback if name missing
      };

      if (user.role !== 'admin') {
        throw new Error('You are not authorized as an admin');
      }

      loginAsAdmin(data.token, user);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="absolute right-3 top-3 rounded p-1 hover:bg-neutral-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h1 className="mb-4 text-xl font-semibold">Admin Login</h1>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full rounded border px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full rounded border px-3 py-2 pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-black py-2 text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
