import axios from "axios";
import AuthService from "./AuthService";
import router from "@/router";

const API_URL = process.env.VUE_APP_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Adding auth token to request");
    } else {
      console.log("No auth token available");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `Response received from ${response.config.url}: Status ${response.status}`
    );
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        AuthService.logout();
        router.push("/");
      }

      if (status === 403) {
        console.error("Permission denied");
      }
      if (status === 500) {
        console.error("Server error");
      }
    } else if (error.request) {
      console.error("Network error - no response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
