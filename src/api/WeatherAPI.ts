import { API_URL } from "@/api/API";

class WeatherAPI {
  private baseUrl = API_URL;

  async getForecast(location: string, days = 5): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/weather/forecast?location=${encodeURIComponent(
        location
      )}&days=${days}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${errorText || "Unknown error"}`
      );
    }

    return await response.json();
  }

  async getForecastByCoords(lat: number, lon: number, days = 5): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/weather/forecast?lat=${lat}&lon=${lon}&days=${days}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${errorText || "Unknown error"}`
      );
    }

    return await response.json();
  }

  async getCurrentWeather(location: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/weather?location=${encodeURIComponent(location)}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${errorText || "Unknown error"}`
      );
    }

    return await response.json();
  }

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/weather?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${errorText || "Unknown error"}`
      );
    }

    return await response.json();
  }

  async searchLocation(query: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/locations/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error: ${response.status} - ${errorText || "Unknown error"}`
      );
    }

    return await response.json();
  }
}

export default new WeatherAPI();
