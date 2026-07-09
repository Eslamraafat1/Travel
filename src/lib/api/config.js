import axios from "axios";

// ===================================================
// API CONFIGURATION
// Toggle USE_MOCK_API to switch between mock data and real backend
// ===================================================
export const USE_MOCK_API = true; // 🔧 Change to false to use real backend

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.yourbackend.com/v1";

// Axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor - add auth token if exists
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle global errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
