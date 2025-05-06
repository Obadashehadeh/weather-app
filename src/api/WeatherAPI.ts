class WeatherAPI {
  private apiKey = "YOUR_WEATHERAPI_KEY";
  private baseUrl = "http://api.weatherapi.com/v1";

  async getForecast(location: string, days = 5): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast.json?key=${
          this.apiKey
        }&q=${encodeURIComponent(location)}&days=${days}&aqi=no`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getCurrentWeather(location: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/current.json?key=${this.apiKey}&q=${encodeURIComponent(
          location
        )}&aqi=no`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getAstronomy(location: string, date = "today"): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/astronomy.json?key=${
          this.apiKey
        }&q=${encodeURIComponent(location)}&dt=${date}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async searchLocation(query: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search.json?key=${this.apiKey}&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default new WeatherAPI();
