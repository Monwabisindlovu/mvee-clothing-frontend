'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // TEMP: mock login (replace with API call)
    if (email === 'admin@store.com' && password === 'admin123') {
      login('mock-jwt-token', { email });
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-2 mb-4"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="w-full bg-black text-white py-2 rounded">
        Login
      </button>
    </div>
  );
}
