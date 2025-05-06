// src/store/modules/weather.ts
import { Module } from "vuex";
import { RootState } from "@/store";
import WeatherService from "@/services/WeatherService";
import LocationService from "@/services/LocationService";
import { AxiosError } from "axios";

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  iconUrl: string;
  windSpeed: number;
  active: boolean;
}

export interface DailyForecast {
  day: string;
  date: string;
  temperature: number;
  condition: string;
  iconUrl: string;
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
  iconUrl: string;
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
  lastUpdated: number;
  fetchingLocations: boolean;
}

const initialState: WeatherState = {
  city: "Athens",
  temperature: 24,
  feelsLike: 22,
  condition: "Sunny",
  iconUrl: "",
  humidity: 41,
  windSpeed: 2,
  pressure: 997,
  uvIndex: 8,
  sunrise: "06:37 AM",
  sunset: "20:37 PM",
  hourlyForecast: [],
  dailyForecast: [],
  savedLocations: [],
  loading: false,
  error: null,
  lastUpdated: 0,
  fetchingLocations: false,
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
    SET_LAST_UPDATED(state, timestamp: number) {
      state.lastUpdated = timestamp;
    },
    SET_FETCHING_LOCATIONS(state, fetching: boolean) {
      state.fetchingLocations = fetching;
    },
  },

  actions: {
    async fetchWeatherByCity({ commit, state }, city: string) {
      const now = Date.now();
      const tenMinutesInMs = 10 * 60 * 1000;

      if (
        state.city === city &&
        now - state.lastUpdated < tenMinutesInMs &&
        state.lastUpdated !== 0
      ) {
        return;
      }

      try {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);

        const weatherData = await WeatherService.getWeatherByCity(city);
        commit("SET_WEATHER_DATA", weatherData);
        commit("SET_LAST_UPDATED", now);
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

    async fetchWeatherByLocation({ commit, state }) {
      const now = Date.now();
      const tenMinutesInMs = 10 * 60 * 1000;

      if (now - state.lastUpdated < tenMinutesInMs && state.lastUpdated !== 0) {
        return;
      }
      try {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);

        const weatherData = await WeatherService.fetchWeatherByLocation();
        commit("SET_WEATHER_DATA", weatherData);
        commit("SET_LAST_UPDATED", now);
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

    async fetchSavedLocations({ commit, state }) {
      if (state.fetchingLocations) {
        return;
      }

      try {
        commit("SET_FETCHING_LOCATIONS", true);
        const locations = await LocationService.getSavedLocations();
        commit("SET_SAVED_LOCATIONS", locations);
      } catch (error) {
        // Handle error silently
      } finally {
        commit("SET_FETCHING_LOCATIONS", false);
      }
    },

    async saveLocation({ commit }, locationData: Partial<Location>) {
      const savedLocation = await LocationService.saveLocation(locationData);
      commit("ADD_SAVED_LOCATION", savedLocation);
      return savedLocation;
    },

    async removeLocation({ commit }, locationId: string) {
      await LocationService.deleteLocation(locationId);
      commit("REMOVE_SAVED_LOCATION", locationId);
    },

    async selectLocation({ dispatch }, location: Location | string) {
      if (typeof location === "object" && location.name) {
        await dispatch("fetchWeatherByCity", location.name);
      } else if (typeof location === "string") {
        await dispatch("fetchWeatherByCity", location);
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
