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
      console.log(`Fetching weather data for city: ${city}`);

      const weatherResponse = await apiClient.get(`/weather`, {
        params: { location: city },
      });

      const forecastResponse = await apiClient.get(`/weather/forecast`, {
        params: { location: city },
      });

      console.log("Weather API response received");
      console.log("Weather data:", weatherResponse.data);
      console.log("Forecast data:", forecastResponse.data);

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
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      console.log("Getting current position from browser geolocation API...");

      // Add timeout for geolocation request
      const timeoutId = setTimeout(() => {
        reject(new Error("Geolocation request timed out"));
      }, 10000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          try {
            const { latitude, longitude } = position.coords;
            console.log(
              `Retrieved coordinates: lat=${latitude}, lon=${longitude}`
            );

            const weatherResponse = await apiClient.get(`/weather`, {
              params: { lat: latitude, lon: longitude },
            });

            const forecastResponse = await apiClient.get(`/weather/forecast`, {
              params: { lat: latitude, lon: longitude },
            });

            console.log("Weather API response received for coordinates");
            console.log("Weather data:", weatherResponse.data);
            console.log("Forecast data:", forecastResponse.data);

            const formattedData = this.formatWeatherData(
              weatherResponse.data,
              forecastResponse.data
            );

            resolve(formattedData);
          } catch (error) {
            console.error("Error fetching weather by location:", error);
            reject(error);
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error("Geolocation error:", error);

          // More user-friendly error messages
          let errorMessage = "Unable to get your location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "You denied the request for geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "The request to get your location timed out.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: false, // High accuracy not needed for weather
          timeout: 8000, // 8 seconds timeout
          maximumAge: 60000, // Allow cached position up to 1 minute old
        }
      );
    });
  }

  formatWeatherData(weatherData: any, forecastData: any): WeatherData {
    console.log("Formatting weather data from API responses");

    // Handle if weather data format is from OpenWeatherMap
    if (weatherData.weather && weatherData.main) {
      // Process daily forecast data
      const dailyForecast = forecastData.list
        ? forecastData.list
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
            })
        : [];

      // Process hourly forecast data
      const hourlyForecast = forecastData.list
        ? forecastData.list.slice(0, 5).map((hour: any, index: number) => {
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
          })
        : [];

      // If UV index is missing, calculate a reasonable approximation
      const calculateUvIndex = () => {
        const weatherCondition = weatherData.weather[0].main.toLowerCase();
        const temp = weatherData.main.temp;

        if (
          weatherCondition.includes("clear") ||
          weatherCondition.includes("sunny")
        ) {
          return Math.min(11, Math.max(1, Math.round(temp / 3)));
        } else if (weatherCondition.includes("cloud")) {
          return Math.min(8, Math.max(1, Math.round(temp / 4)));
        } else {
          return Math.min(5, Math.max(1, Math.round(temp / 6)));
        }
      };

      // Format sunrise and sunset times
      const formatTimeFromTimestamp = (timestamp: number) => {
        if (!timestamp) return "00:00 AM";

        try {
          return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        } catch (e) {
          console.error("Error formatting time:", e);
          return "00:00 AM";
        }
      };

      return {
        city: weatherData.name || "Unknown Location",
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        condition: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed),
        pressure: Math.round(weatherData.main.pressure),
        uvIndex: weatherData.uvi || calculateUvIndex(),
        sunrise:
          weatherData.sys && weatherData.sys.sunrise
            ? formatTimeFromTimestamp(weatherData.sys.sunrise)
            : "06:00 AM",
        sunset:
          weatherData.sys && weatherData.sys.sunset
            ? formatTimeFromTimestamp(weatherData.sys.sunset)
            : "06:00 PM",
        hourlyForecast,
        dailyForecast,
      };
    }
    // Handle API response in a different format or mock data
    else {
      console.log("Using alternative API data format or mock data");

      return {
        city: weatherData.name || weatherData.city || "Unknown",
        temperature:
          typeof weatherData.temperature !== "undefined"
            ? weatherData.temperature
            : weatherData.main?.temp
            ? Math.round(weatherData.main.temp)
            : 25,
        feelsLike:
          typeof weatherData.feelsLike !== "undefined"
            ? weatherData.feelsLike
            : weatherData.main?.feels_like
            ? Math.round(weatherData.main.feels_like)
            : 24,
        condition:
          weatherData.condition ||
          (weatherData.weather && weatherData.weather[0]?.main) ||
          weatherData.weather_condition ||
          "Sunny",
        humidity:
          typeof weatherData.humidity !== "undefined"
            ? weatherData.humidity
            : weatherData.main?.humidity || 50,
        windSpeed:
          typeof weatherData.windSpeed !== "undefined"
            ? weatherData.windSpeed
            : weatherData.wind?.speed
            ? Math.round(weatherData.wind.speed)
            : 5,
        pressure:
          typeof weatherData.pressure !== "undefined"
            ? weatherData.pressure
            : weatherData.main?.pressure || 1013,
        uvIndex: weatherData.uvIndex || weatherData.uv_index || 5,
        sunrise:
          weatherData.sunrise ||
          (weatherData.sys?.sunrise
            ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(
                "en-US",
                { hour: "2-digit", minute: "2-digit", hour12: true }
              )
            : "06:00 AM"),
        sunset:
          weatherData.sunset ||
          (weatherData.sys?.sunset
            ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(
                "en-US",
                { hour: "2-digit", minute: "2-digit", hour12: true }
              )
            : "20:00 PM"),
        hourlyForecast:
          weatherData.hourlyForecast ||
          forecastData.hourlyForecast ||
          this.getDefaultHourlyForecast(),
        dailyForecast:
          weatherData.dailyForecast ||
          forecastData.dailyForecast ||
          this.getDefaultDailyForecast(),
      };
    }
  }

  // Default data in case API fails
  private getDefaultHourlyForecast() {
    return [
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
        condition: "Partly Cloudy",
        windSpeed: 4,
        active: false,
      },
      {
        time: "18:00",
        temperature: 25,
        condition: "Clear",
        windSpeed: 3,
        active: false,
      },
      {
        time: "21:00",
        temperature: 22,
        condition: "Clear",
        windSpeed: 2,
        active: false,
      },
      {
        time: "00:00",
        temperature: 20,
        condition: "Clear",
        windSpeed: 2,
        active: false,
      },
    ];
  }

  private getDefaultDailyForecast() {
    return [
      {
        day: "Today",
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        temperature: 26,
        condition: "Sunny",
      },
      {
        day: "Tomorrow",
        date: new Date(Date.now() + 86400000).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        temperature: 28,
        condition: "Sunny",
      },
      {
        day: new Date(Date.now() + 172800000).toLocaleDateString("en-US", {
          weekday: "long",
        }),
        date: new Date(Date.now() + 172800000).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        temperature: 25,
        condition: "Partly Cloudy",
      },
      {
        day: new Date(Date.now() + 259200000).toLocaleDateString("en-US", {
          weekday: "long",
        }),
        date: new Date(Date.now() + 259200000).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        temperature: 23,
        condition: "Cloudy",
      },
      {
        day: new Date(Date.now() + 345600000).toLocaleDateString("en-US", {
          weekday: "long",
        }),
        date: new Date(Date.now() + 345600000).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        temperature: 22,
        condition: "Rainy",
      },
    ];
  }
}

export default new WeatherService();
