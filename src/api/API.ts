import axios from "axios";
import AuthService from "@/services/AuthService";

export const API_URL = process.env.VUE_APP_API_URL || "http://localhost:3000";

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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      AuthService.logout();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const WeatherAPI = {
  getCurrentWeather(location: string) {
    return apiClient.get("/weather", {
      params: { location },
    });
  },

  getCurrentWeatherByCoords(lat: number, lon: number) {
    return apiClient.get("/weather", {
      params: { lat, lon },
    });
  },

  getForecast(location: string, days = 5) {
    return apiClient.get("/weather/forecast", {
      params: { location, days },
    });
  },

  getForecastByCoords(lat: number, lon: number, days = 5) {
    return apiClient.get("/weather/forecast", {
      params: { lat, lon, days },
    });
  },
};

export const LocationsAPI = {
  getSavedLocations() {
    return apiClient.get("/locations");
  },

  saveLocation(locationData: any) {
    return apiClient.post("/locations", locationData);
  },

  deleteLocation(id: string) {
    return apiClient.delete(`/locations/${id}`);
  },
};

export default { WeatherAPI, LocationsAPI };
