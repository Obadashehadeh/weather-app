// src/services/WeatherService.ts
import apiClient from "./api";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface WeatherData {
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
  hourlyForecast: Array<{
    time: string;
    temperature: number;
    condition: string;
    windSpeed: number;
    active: boolean;
  }>;
  dailyForecast: Array<{
    day: string;
    date: string;
    temperature: number;
    condition: string;
  }>;
}

class WeatherService {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const weatherResponse = await apiClient.get(`/weather`, {
        params: { location: city },
      });

      const forecastResponse = await apiClient.get(`/weather/forecast`, {
        params: { location: city },
      });

      const formattedData = this.formatWeatherData(
        weatherResponse.data,
        forecastResponse.data
      );

      return formattedData;
    } catch (error) {
      console.error("Error fetching weather by city:", error);
      throw error;
    }
  }

  async fetchWeatherByLocation(): Promise<WeatherData> {
    return new Promise<WeatherData>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log(position);
            const { latitude, longitude } = position.coords;

            const weatherResponse = await apiClient.get(`/weather`, {
              params: { lat: latitude, lon: longitude },
            });

            const forecastResponse = await apiClient.get(`/weather/forecast`, {
              params: { lat: latitude, lon: longitude },
            });

            const formattedData = this.formatWeatherData(
              weatherResponse.data,
              forecastResponse.data
            );

            resolve(formattedData);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  formatWeatherData(weatherData: any, forecastData: any): WeatherData {
    const dailyForecast = forecastData.list
      .filter((_: any, index: number) => index % 8 === 0)
      .slice(0, 5)
      .map((day: any) => {
        const date = new Date(day.dt * 1000);
        return {
          day: date.toLocaleDateString("en-US", { weekday: "long" }),
          date: date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          }),
          temperature: Math.round(day.main.temp),
          condition: day.weather[0].main,
        };
      });

    const hourlyForecast = forecastData.list
      .slice(0, 5)
      .map((hour: any, index: number) => {
        const date = new Date(hour.dt * 1000);
        return {
          time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          temperature: Math.round(hour.main.temp),
          condition: hour.weather[0].main,
          windSpeed: Math.round(hour.wind.speed),
          active: index === 0,
        };
      });

    return {
      city: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      condition: weatherData.weather[0].main,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed),
      pressure: Math.round(weatherData.main.pressure),
      uvIndex: 5,
      sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      ),
      sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      ),
      hourlyForecast,
      dailyForecast,
    };
  }
}

export default new WeatherService();
