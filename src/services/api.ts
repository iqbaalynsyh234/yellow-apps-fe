import { LoginCredentials, AuthResponse, AuthError } from '@/types/auth';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getHeaders = (includeAuth = false) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = Cookies.get(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token');
    if (!token) {
      throw new ApiError(401, 'No authentication token found');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const api = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(response.status, error.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token in cookie
      if (data.token) {
        Cookies.set(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', data.token, { 
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  },

  async getAuthUser() {
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: getHeaders(true),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(response.status, error.message || 'Failed to fetch user');
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  },

  async getLabels() {
    try {
      const response = await fetch(`${API_URL}/v1/labels`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(response.status, error.message || 'Failed to fetch labels');
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  },

  async logout() {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(response.status, error.message || 'Logout failed');
      }

      // Remove token from cookie
      Cookies.remove(process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token', { path: '/' });
      
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  },

  async getCategories() {
    try {
      const response = await fetch(`${API_URL}/v1/categories`, {
        headers: getHeaders(true),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(response.status, error.message || 'Failed to fetch categories');
      }
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Network error occurred');
    }
  },

  async createLabel(data: { name: string; category_id: number }) {
    try {
      const response = await fetch(`${API_URL}/v1/labels`, {
        method: 'POST',
        headers: getHeaders(true),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(response.status, error.message || 'Failed to create label');
      }
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Network error occurred');
    }
  },

  async deleteLabel(labelId: number) {
    try {
      const response = await fetch(`${API_URL}/v1/labels/${labelId}`, {
        method: 'DELETE',
        headers: getHeaders(true),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(response.status, error.message || 'Failed to delete label');
      }
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, 'Network error occurred');
    }
  },
}; 