import axios from "axios";
import { WeatherResponse, formatWeatherData } from "@/types/weather";

const API_URL = "http://localhost:3000/weather";

class WeatherService {
  async getWeatherByCity(city: string) {
    try {
      await axios.post(`${API_URL}/history/${encodeURIComponent(city)}`);

      const externalResponse = await axios.get<WeatherResponse>(
        `https://api.weatherapi.com/v1/forecast.json?key=${
          process.env.VUE_APP_WEATHER_API_KEY
        }&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`
      );

      const formattedData = formatWeatherData(externalResponse.data);

      await axios.post(API_URL, formattedData);

      return formattedData;
    } catch (error) {
      console.error("Error fetching weather by city:", error);
      throw error;
    }
  }

  async getSearchHistory() {
    try {
      const response = await axios.get(`${API_URL}/history`);
      return response.data;
    } catch (error) {
      console.error("Error fetching search history:", error);
      throw error;
    }
  }
}

export default new WeatherService();
