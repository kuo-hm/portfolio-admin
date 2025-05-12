import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { handleRefreshToken } from '@/hooks/use-refresh';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});



api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error: AxiosError) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !(originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry) {
      return handleRefreshToken(originalRequest);
    }

    return Promise.reject(error);
  }
); 