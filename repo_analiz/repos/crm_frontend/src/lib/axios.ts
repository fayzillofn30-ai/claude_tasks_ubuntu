// src/lib/axios.ts
import axios, { AxiosInstance } from 'axios';
import {create} from "zustand"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:15976/api';

function createAPI(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: attach token if exists
  instance.interceptors.request.use((config) => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (raw && config.headers) {
        config.headers.Authorization = `Bearer ${raw}`;
      }
    } catch (e) {
      // ignore (SSR or blocked)
    }
    return config;
  });

  // Response interceptor: unify errors
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      // Optionally handle global errors (401 refresh flow, toast, logging)
      const res = error.response;
      if (res && res.status === 401) {
        // e.g. redirect to login or emit event
        // window.location.href = '/login'
      }
      return Promise.reject(res?.data || error);
    },
  );

  return instance;
}

export const api = createAPI();
export default api;
