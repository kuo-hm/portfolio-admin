import { create } from 'zustand';
import { api } from '@/lib/api';
import { LoginResponse } from '@/types/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
interface AuthState {
  user: LoginResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', data.token);
      document.cookie = `token=${data.token}; path=/; max-age=86400; samesite=strict`;

      set({ user: data.user, token: data.token });
      toast.success(data.message || 'Welcome back!');
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message || 'Invalid email or password' : 'An unexpected error occurred';
      toast.error(message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    set({ user: null, token: null });
    window.location.href = '/login';
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get<LoginResponse['user']>('/auth/me');
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ user: null, token: null, isLoading: false });
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to check authentication');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  },
})); 