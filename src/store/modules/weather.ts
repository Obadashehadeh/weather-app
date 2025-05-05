import { Module } from "vuex";
import { RootState } from "@/store";
import WeatherService from "@/services/WeatherService";
import LocationService from "@/services/LocationService";
import { AxiosError } from "axios";

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
  lastUpdated: number;
  fetchingLocations: boolean;
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
      // Check if we already have recent data for this city (within last 10 minutes)
      const now = Date.now();
      const tenMinutesInMs = 10 * 60 * 1000;

      if (
        state.city === city &&
        now - state.lastUpdated < tenMinutesInMs &&
        state.lastUpdated !== 0
      ) {
        console.log(
          `Using cached weather data for ${city} (last updated ${Math.round(
            (now - state.lastUpdated) / 1000
          )} seconds ago)`
        );
        return;
      }

      try {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);
        console.log(`Fetching weather data for city: ${city}`);

        const weatherData = await WeatherService.getWeatherByCity(city);
        commit("SET_WEATHER_DATA", weatherData);
        commit("SET_LAST_UPDATED", now);
        commit("SET_LOADING", false);
        console.log(`Weather data received for ${city}`);
      } catch (error) {
        console.error("Error fetching weather:", error);
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
        console.log(
          `Using cached weather data (last updated ${Math.round(
            (now - state.lastUpdated) / 1000
          )} seconds ago)`
        );
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

    async fetchSavedLocations({ commit, state }) {
      // Prevent multiple simultaneous calls
      if (state.fetchingLocations) {
        console.log("Already fetching locations, skipping duplicate call");
        return;
      }

      try {
        commit("SET_FETCHING_LOCATIONS", true);
        console.log("Fetching saved locations");

        const locations = await LocationService.getSavedLocations();
        commit("SET_SAVED_LOCATIONS", locations);
        console.log(`Fetched ${locations.length} saved locations`);
      } catch (error) {
        console.error("Error fetching saved locations:", error);
      } finally {
        commit("SET_FETCHING_LOCATIONS", false);
      }
    },

    async saveLocation({ commit }, locationData: Partial<Location>) {
      try {
        console.log(`Saving location: ${locationData.name}`);
        const savedLocation = await LocationService.saveLocation(locationData);
        commit("ADD_SAVED_LOCATION", savedLocation);
        console.log(`Location saved: ${savedLocation.name}`);
        return savedLocation;
      } catch (error) {
        console.error("Error saving location:", error);
        throw error;
      }
    },

    async removeLocation({ commit }, locationId: string) {
      try {
        console.log(`Removing location with ID: ${locationId}`);
        await LocationService.deleteLocation(locationId);
        commit("REMOVE_SAVED_LOCATION", locationId);
        console.log("Location removed successfully");
      } catch (error) {
        console.error("Error removing location:", error);
        throw error;
      }
    },

    async selectLocation({ dispatch }, location: Location | string) {
      try {
        // If we have a location object with name property
        if (typeof location === "object" && location.name) {
          console.log(`Selecting location by object: ${location.name}`);
          await dispatch("fetchWeatherByCity", location.name);
        }
        // If we just have a location name as string
        else if (typeof location === "string") {
          console.log(`Selecting location by string: ${location}`);
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
