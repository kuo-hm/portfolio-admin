import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

let isRefreshing = false;
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const refreshToken = async () => {
  try {
    const { data } = await api.post('/auth/refresh');
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || 'Session expired. Please login again.');
    } else {
      toast.error('Failed to refresh session');
    }
    throw error;
  }
};

export const handleRefreshToken = async (originalRequest: InternalAxiosRequestConfig) => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then(() => {
        return api(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  (originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry = true;
  isRefreshing = true;

  try {
    await refreshToken();
    processQueue();
    return api(originalRequest);
  } catch (error) {
    processQueue(error);
    if (!window.location.pathname.startsWith('/login')) {
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?from=${returnUrl}`;
    }
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}; 