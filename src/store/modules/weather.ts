import { Module } from "vuex";
import { RootState } from "@/store";
import axios from "axios";

const API_KEY = "YOUR_WEATHER_API_KEY";
const BASE_URL = "https://api.weatherapi.com/v1";

export interface WeatherData {
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
  loading: boolean;
  error: string | null;
}

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

const initialState: WeatherData = {
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
  loading: false,
  error: null,
};

const weatherModule: Module<WeatherData, RootState> = {
  namespaced: true,

  state: { ...initialState },

  mutations: {
    SET_WEATHER_DATA(state, data: Partial<WeatherData>) {
      Object.assign(state, data);
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

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const formattedData = {
          city,
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
            {
              day: "Saturday",
              date: "2 Sep",
              temperature: 22,
              condition: "Sunny",
            },
            {
              day: "Sunday",
              date: "3 Sep",
              temperature: 27,
              condition: "Sunny",
            },
            {
              day: "Monday",
              date: "4 Sep",
              temperature: 18,
              condition: "Rainy",
            },
            {
              day: "Tuesday",
              date: "5 Sep",
              temperature: 16,
              condition: "Rainy",
            },
          ],
        };

        commit("SET_WEATHER_DATA", formattedData);
        commit("SET_LOADING", false);
      } catch (error) {
        commit(
          "SET_ERROR",
          error instanceof Error ? error.message : "An error occurred"
        );
        commit("SET_LOADING", false);
        console.error("Error fetching weather:", error);
      }
    },

    async fetchWeatherByLocation({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("SET_ERROR", null);

        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );

        const { latitude, longitude } = position.coords;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const formattedData = {
          city: "Your Location",
          temperature: 22,
          feelsLike: 20,
          condition: "Partly Cloudy",
          humidity: 45,
          windSpeed: 3,
          pressure: 1000,
          uvIndex: 6,
          sunrise: "06:40 AM",
          sunset: "20:30 PM",
          hourlyForecast: [
            {
              time: "12:00",
              temperature: 22,
              condition: "Partly Cloudy",
              windSpeed: 3,
              active: true,
            },
            {
              time: "15:00",
              temperature: 24,
              condition: "Sunny",
              windSpeed: 3,
              active: false,
            },
            {
              time: "18:00",
              temperature: 23,
              condition: "Partly Cloudy",
              windSpeed: 2,
              active: false,
            },
            {
              time: "21:00",
              temperature: 20,
              condition: "Clear",
              windSpeed: 2,
              active: false,
            },
            {
              time: "00:00",
              temperature: 18,
              condition: "Clear",
              windSpeed: 1,
              active: false,
            },
          ],
          dailyForecast: [
            {
              day: "Friday",
              date: "1 Sep",
              temperature: 22,
              condition: "Partly Cloudy",
            },
            {
              day: "Saturday",
              date: "2 Sep",
              temperature: 24,
              condition: "Sunny",
            },
            {
              day: "Sunday",
              date: "3 Sep",
              temperature: 25,
              condition: "Sunny",
            },
            {
              day: "Monday",
              date: "4 Sep",
              temperature: 20,
              condition: "Partly Cloudy",
            },
            {
              day: "Tuesday",
              date: "5 Sep",
              temperature: 19,
              condition: "Rainy",
            },
          ],
        };

        commit("SET_WEATHER_DATA", formattedData);
        commit("SET_LOADING", false);
      } catch (error) {
        commit(
          "SET_ERROR",
          error instanceof Error ? error.message : "An error occurred"
        );
        commit("SET_LOADING", false);
        console.error("Error fetching weather by location:", error);
      }
    },
  },

  getters: {
    weatherData: (state) => state,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
  },
};

export default weatherModule;
