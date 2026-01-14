import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL ;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'x-bypass-localization': 'true', // Ensure Admin gets full multi-lang data
  },
});

// Request Interceptor: Attach Token & Log (Dev only)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors Globaly
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response.data; // Return just data for convenience
  },
  (error) => {
    const { response } = error;
    const errorMessage = response?.data?.message || error.message || "An unexpected error occurred";

    // Log error only in dev
    if (import.meta.env.DEV) {
      console.error("[API Error]", error);
    }

    // Global Error Notification
    if (response) {
      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        // Optional: Redirect to login
        // window.location.href = '/login'; 
      } else if (response.status === 403) {
        toast.error("You do not have permission to perform this action.");
      } else if (response.status >= 500) {
        toast.error("Server error. Please try again later.");
      } else {
         // for 400 and others, let the specific component handle it or show generic
         // toast.error(errorMessage);
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
