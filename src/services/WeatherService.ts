import { WeatherAPI } from "@/api/API";

export interface WeatherData {
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
  hourlyForecast: Array<{
    time: string;
    temperature: number;
    condition: string;
    iconUrl: string;
    windSpeed: number;
    active: boolean;
  }>;
  dailyForecast: Array<{
    day: string;
    date: string;
    temperature: number;
    condition: string;
    iconUrl: string;
  }>;
}

class WeatherService {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    const response = await WeatherAPI.getForecast(city, 5);
    return this.formatWeatherData(response.data);
  }

  async fetchWeatherByLocation(): Promise<WeatherData> {
    return new Promise<WeatherData>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error("Geolocation request timed out"));
      }, 10000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(timeoutId);
          try {
            const { latitude, longitude } = position.coords;
            const response = await WeatherAPI.getForecastByCoords(
              latitude,
              longitude,
              5
            );
            const formattedData = this.formatWeatherData(response.data);
            resolve(formattedData);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          clearTimeout(timeoutId);
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
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 60000,
        }
      );
    });
  }

  formatWeatherData(data: any): WeatherData {
    const dailyForecast = data.forecast.forecastday.map((day: any) => {
      const date = new Date(day.date);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "long" }),
        date: date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        temperature: Math.round(day.day.avgtemp_c),
        condition: day.day.condition.text,
        iconUrl: this.getFullIconUrl(day.day.condition.icon),
      };
    });

    const hourlyForecast = data.forecast.forecastday[0].hour
      .filter((_: any, index: number) => index % 3 === 0)
      .map((hour: any, index: number) => {
        const date = new Date(hour.time);
        return {
          time: date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          temperature: Math.round(hour.temp_c),
          condition: hour.condition.text,
          iconUrl: this.getFullIconUrl(hour.condition.icon),
          windSpeed: Math.round(hour.wind_kph),
          active: index === 0,
        };
      });

    const current = data.current;
    const location = data.location;
    const astronomy = data.forecast.forecastday[0].astro;

    return {
      city: location.name,
      temperature: Math.round(current.temp_c),
      feelsLike: Math.round(current.feelslike_c),
      condition: current.condition.text,
      iconUrl: this.getFullIconUrl(current.condition.icon),
      humidity: current.humidity,
      windSpeed: Math.round(current.wind_kph),
      pressure: Math.round(current.pressure_mb),
      uvIndex: current.uv,
      sunrise: astronomy.sunrise,
      sunset: astronomy.sunset,
      hourlyForecast,
      dailyForecast,
    };
  }

  private getFullIconUrl(iconPath: string): string {
    if (iconPath.startsWith("//")) {
      return `https:${iconPath}`;
    }
    return iconPath;
  }
}

export default new WeatherService();
