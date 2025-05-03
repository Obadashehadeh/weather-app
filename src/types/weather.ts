export interface WeatherResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        uv: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: string;
        is_moon_up: number;
        is_sun_up: number;
      };
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        will_it_rain: number;
        chance_of_rain: number;
        will_it_snow: number;
        chance_of_snow: number;
        vis_km: number;
        vis_miles: number;
        gust_mph: number;
        gust_kph: number;
        uv: number;
      }>;
    }>;
  };
}

export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionIcon?: string;
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
  conditionIcon?: string;
  windSpeed: number;
  active: boolean;
}

export interface DailyForecast {
  day: string;
  date: string;
  temperature: number;
  condition: string;
  conditionIcon?: string;
}

export const formatWeatherData = (
  data: WeatherResponse
): Omit<WeatherData, "loading" | "error"> => {
  const current = data.current;
  const location = data.location;
  const forecast = data.forecast;

  const dailyForecast: DailyForecast[] = forecast.forecastday.map((day) => {
    const date = new Date(day.date);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
      temperature: Math.round(day.day.avgtemp_c),
      condition: day.day.condition.text,
      conditionIcon: day.day.condition.icon,
    };
  });

  const currentHour = new Date().getHours();
  const hourlyForecast: HourlyForecast[] = [];

  for (let i = 0; i < forecast.forecastday.length; i++) {
    const hours = forecast.forecastday[i].hour;

    for (let j = 0; j < hours.length; j++) {
      const hourData = hours[j];
      const hourTime = new Date(hourData.time).getHours();

      if (i === 0 && hourTime < currentHour) continue;

      hourlyForecast.push({
        time: new Date(hourData.time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        temperature: Math.round(hourData.temp_c),
        condition: hourData.condition.text,
        conditionIcon: hourData.condition.icon,
        windSpeed: Math.round(hourData.wind_kph),
        active: i === 0 && hourTime === currentHour,
      });

      if (hourlyForecast.length === 5) break;
    }

    if (hourlyForecast.length === 5) break;
  }

  return {
    city: location.name,
    temperature: Math.round(current.temp_c),
    feelsLike: Math.round(current.feelslike_c),
    condition: current.condition.text,
    conditionIcon: current.condition.icon,
    humidity: current.humidity,
    windSpeed: Math.round(current.wind_kph),
    pressure: Math.round(current.pressure_mb),
    uvIndex: Math.round(current.uv),
    sunrise: forecast.forecastday[0].astro.sunrise,
    sunset: forecast.forecastday[0].astro.sunset,
    hourlyForecast,
    dailyForecast,
  };
};
