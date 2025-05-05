import axios from "axios";
import AuthService from "./AuthService";
import router from "@/router";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token expired or invalid
        AuthService.logout();
        router.push("/");
      }

      if (status === 403) {
        // Permission denied
        console.error("Permission denied");
      }

      if (status === 500) {
        console.error("Server error");
      }
    } else if (error.request) {
      console.error("Network error - no response received");
    } else {
      console.error("Error setting up request", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
