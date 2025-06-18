'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginForm() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Login berhasil!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    }
  }, [isAuthenticated]);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D9D9D9]">
      <div className="w-full max-w-md bg-white rounded-none flex flex-col items-center px-8 py-12 shadow-md">
        <h1 className="text-4xl font-bold text-[#FFC700] mb-2 w-full text-left">Selamat<br/>Datang!</h1>
        <p className="text-gray-700 mb-8 w-full text-left">Masukkan nomor telepon yang telah didaftarkan</p>
        <Toaster position="top-center" />
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-lg bg-[#F3F3F3] border-none px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          />
          {validationErrors.email && (
            <p className="text-sm text-red-600">{validationErrors.email}</p>
          )}
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="rounded-lg bg-[#F3F3F3] border-none px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC700]"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          />
          {validationErrors.password && (
            <p className="text-sm text-red-600">{validationErrors.password}</p>
          )}
          {error && (
            <div className="rounded bg-red-50 p-2 text-red-700 text-sm">{error.message}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-lg bg-[#FFC700] text-white font-semibold py-3 transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">Ada kendala silahkan hubungi admin 👋</p>
      </div>
    </div>
  );
} 