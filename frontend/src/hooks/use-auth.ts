import { create } from 'zustand';
import { api, authApi } from '@/lib/api';
import { LoginResponse } from '@/types/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface AuthState {
  user: LoginResponse['user'] | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const { data } = await authApi.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      set({ user: data.user });
      toast.success(data.message || 'Welcome back!');
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message || 'Invalid email or password' : 'An unexpected error occurred';
      toast.error(message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null });
      window.location.href = '/login';
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get<LoginResponse['user']>('/auth/me');
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to check authentication');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  },
})); 