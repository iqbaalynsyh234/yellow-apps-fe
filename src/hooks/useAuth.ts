'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentials, AuthState, AuthError } from '@/types/auth';
import { api } from '@/services/api';
import Cookies from 'js-cookie';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
    if (!token) {
      setState(initialState);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const user = await api.getAuthUser();
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', { path: '/' });
      setState(initialState);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await api.login(credentials);
      
      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      Cookies.set(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', response.token, { path: '/' });

      router.push('/dashboard');
    } catch (error) {
      const authError: AuthError = {
        message: error instanceof Error ? error.message : 'An error occurred',
        status: error instanceof Error && 'status' in error ? (error as any).status : 500,
      };

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authError,
      }));
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
      setState(initialState);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      Cookies.remove(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', { path: '/' });
      setState(initialState);
      router.push('/');
    }
  }, [router]);

  return {
    ...state,
    login,
    logout,
    checkAuth,
  };
}; 