import axios from 'axios';
import { User, LoginResponse, MarketingForm, FormWithResults, ApiResponse } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api' 
  : process.env.REACT_APP_API_URL || 'https://seu-backend-url.herokuapp.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    user_type: 'admin' | 'client';
  }): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.user_type === 'admin';
  },

  isClient: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.user_type === 'client';
  }
};

// Form Services
export const formService = {
  createForm: async (formData: {
    nicho: string;
    objetivo: string;
    publico_alvo: string;
    frequencia_posts: number;
    tom_voz: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/forms', formData);
    return response.data;
  },

  getMyForms: async (): Promise<{ success: boolean; forms: MarketingForm[] }> => {
    const response = await api.get('/forms/my-forms');
    return response.data;
  },

  getFormById: async (id: number): Promise<{ success: boolean } & FormWithResults> => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },

  getAllForms: async (): Promise<{ success: boolean; forms: MarketingForm[] }> => {
    const response = await api.get('/forms');
    return response.data;
  }
};

// AI Services
export const aiService = {
  generateContent: async (formId: number): Promise<ApiResponse> => {
    const response = await api.post(`/ai/generate/${formId}`);
    return response.data;
  },

  updatePost: async (postId: number, postData: {
    titulo: string;
    legenda: string;
    tipo_post: string;
    hashtags: string;
  }): Promise<ApiResponse> => {
    const response = await api.put(`/ai/posts/${postId}`, postData);
    return response.data;
  }
};

// User Services
export const userService = {
  getAllUsers: async (): Promise<{ success: boolean; users: User[] }> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<{ success: boolean; user: User }> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, userData: {
    name: string;
    email: string;
    password?: string;
  }): Promise<ApiResponse> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getStats: async (): Promise<{
    success: boolean;
    stats: {
      totalUsers: number;
      totalClients: number;
      totalForms: number;
      totalPosts: number;
    }
  }> => {
    const response = await api.get('/users/stats/overview');
    return response.data;
  }
};

export default api;