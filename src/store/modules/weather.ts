// src/store/modules/weather.ts
import { Module } from "vuex";
import { RootState } from "@/store";
import WeatherService from "@/services/WeatherService";
import LocationService from "@/services/LocationService";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  active: boolean;
}

export interface DailyForecast {
  day: string;
  date: string;
  temperature: number;
  condition: string;
}

export interface Location {
  _id: string;
  name: string;
  country?: string;
  lat?: number;
  lon?: number;
  user?: string;
}

export interface WeatherState {
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  savedLocations: Location[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  city: "Athens",
  temperature: 24,
  feelsLike: 22,
  condition: "Sunny",
  humidity: 41,
  windSpeed: 2,
  pressure: 997,
  uvIndex: 8,
  sunrise: "06:37 AM",
  sunset: "20:37 PM",
  hourlyForecast: [
    {
      time: "12:00",
      temperature: 26,
      condition: "Sunny",
      windSpeed: 3,
      active: true,
    },
    {
      time: "15:00",
      temperature: 27,
      condition: "Sunny",
      windSpeed: 2,
      active: false,
    },
    {
      time: "18:00",
      temperature: 27,
      condition: "Partly Cloudy",
      windSpeed: 2,
      active: false,
    },
    {
      time: "21:00",
      temperature: 25,
      condition: "Rainy",
      windSpeed: 3,
      active: false,
    },
    {
      time: "00:00",
      temperature: 22,
      condition: "Sunny",
      windSpeed: 3,
      active: false,
    },
  ],
  dailyForecast: [
    {
      day: "Friday",
      date: "1 Sep",
      temperature: 20,
      condition: "Partly Cloudy",
    },
    { day: "Saturday", date: "2 Sep", temperature: 22, condition: "Sunny" },
    { day: "Sunday", date: "3 Sep", temperature: 27, condition: "Sunny" },
    { day: "Monday", date: "4 Sep", temperature: 18, condition: "Rainy" },
    { day: "Tuesday", date: "5 Sep", temperature: 16, condition: "Rainy" },
  ],
  savedLocations: [],
  loading: false,
  error: null,
};

const weatherModule: Module<WeatherState, RootState> = {
  namespaced: true,

  state: { ...initialState },

  mutations: {
    SET_WEATHER_DATA(state, data: Partial<WeatherState>) {
      Object.assign(state, data);
    },
    SET_SAVED_LOCATIONS(state, locations: Location[]) {
      state.savedLocations = locations;
    },
    ADD_SAVED_LOCATION(state, location: Location) {
      state.savedLocations.push(location);
    },
    REMOVE_SAVED_LOCATION(state, locationId: string) {
      state.savedLocations = state.savedLocations.filter(
        (loc) => loc._id !== locationId
      );
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    SET_ERROR(state, error: string | null) {
      state.error = error;
    },
  },

  actions: {
    async fetchWeatherByCity({ commit }, city: string) {
      try {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);

        const weatherData = await WeatherService.getWeatherByCity(city);
        commit("SET_WEATHER_DATA", weatherData);
        commit("SET_LOADING", false);
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        commit(
          "SET_ERROR",
          axiosError.response?.data?.message || "Failed to fetch weather data"
        );
        commit("SET_LOADING", false);
        throw error;
      }
    },

    async fetchWeatherByLocation({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);

        const weatherData = await WeatherService.fetchWeatherByLocation();
        commit("SET_WEATHER_DATA", weatherData);
        commit("SET_LOADING", false);
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Authentication failed. Please check your credentials.";
        commit(
          "SET_ERROR",
          axiosError.response?.data?.message || "Failed to fetch weather data"
        );
        commit("SET_LOADING", false);
        throw error;
      }
    },

    async fetchSavedLocations({ commit }) {
      try {
        commit("SET_LOADING", true);

        const locations = await LocationService.getSavedLocations();
        commit("SET_SAVED_LOCATIONS", locations);
        commit("SET_LOADING", false);
      } catch (error) {
        console.error("Error fetching saved locations:", error);
        commit("SET_LOADING", false);
      }
    },

    async saveLocation({ commit }, locationData: Partial<Location>) {
      try {
        const savedLocation = await LocationService.saveLocation(locationData);
        commit("ADD_SAVED_LOCATION", savedLocation);
        return savedLocation;
      } catch (error) {
        console.error("Error saving location:", error);
        throw error;
      }
    },

    async removeLocation({ commit }, locationId: string) {
      try {
        await LocationService.deleteLocation(locationId);
        commit("REMOVE_SAVED_LOCATION", locationId);
      } catch (error) {
        console.error("Error removing location:", error);
        throw error;
      }
    },

    async selectLocation({ dispatch }, location: Location | string) {
      try {
        // If we have a location object with name property
        if (typeof location === "object" && location.name) {
          await dispatch("fetchWeatherByCity", location.name);
        }
        // If we just have a location name as string
        else if (typeof location === "string") {
          await dispatch("fetchWeatherByCity", location);
        }
      } catch (error) {
        console.error("Error selecting location:", error);
        throw error;
      }
    },
  },

  getters: {
    weatherData: (state) => state,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    getSavedLocations: (state) => state.savedLocations,
  },
};

export default weatherModule;
