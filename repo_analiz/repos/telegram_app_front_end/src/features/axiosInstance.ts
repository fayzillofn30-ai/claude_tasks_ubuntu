import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:15976/api",
});

// === Request interceptor ===
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (token && config && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

// === Response interceptor ===
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("sessionToken");
      if (typeof window !== "undefined") {
        window.location.href = "/sign";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
