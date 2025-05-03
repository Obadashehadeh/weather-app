<template>
  <div class="home" :class="{ 'dark-mode': isDarkMode }">
    <div class="container mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-4">
        <SearchBar
          @search="searchCity"
          @get-current-location="getCurrentLocation"
        />
      </div>

      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Loading weather data...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="retry" class="retry-button">Try Again</button>
      </div>

      <div v-else class="weather-grid">
        <div class="grid-row top-section">
          <div class="grid-item header w-lg">
            <WeatherHeader :city="weather.city" />
          </div>

          <!--          <div class="grid-item current">-->
          <!--            <CurrentWeather-->
          <!--              :temperature="weather.temperature"-->
          <!--              :feels-like="weather.feelsLike"-->
          <!--              :condition="weather.condition"-->
          <!--            />-->
          <!--          </div>-->

          <div class="grid-item details">
            <WeatherDetails
              :sunrise-time="weather.sunrise"
              :sunset-time="weather.sunset"
              :humidity="weather.humidity"
              :wind-speed="weather.windSpeed"
              :pressure="weather.pressure"
              :uv-index="weather.uvIndex"
            />
          </div>
        </div>

        <div class="grid-row bottom-section">
          <div class="grid-item daily">
            <DailyForecast :forecast-data="weather.dailyForecast" />
          </div>

          <div class="grid-item hourly">
            <HourlyForecast :forecast-data="weather.hourlyForecast" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useStore } from "vuex";
import WeatherHeader from "@/components/WeatherHeader.vue";
// import CurrentWeather from "@/components/CurrentWeather.vue";
import WeatherDetails from "@/components/WeatherDetails.vue";
import HourlyForecast from "@/components/HourlyForecast.vue";
import DailyForecast from "@/components/DailyForecast.vue";
import SearchBar from "@/components/SearchBar.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    WeatherHeader,
    WeatherDetails,
    HourlyForecast,
    DailyForecast,
    SearchBar,
  },
  setup() {
    const store = useStore();

    const isDarkMode = computed(() => store.state.theme.darkMode);

    const weather = computed(() => store.state.weather);
    const loading = computed(() => store.state.weather.loading);
    const error = computed(() => store.state.weather.error);

    const searchCity = (city: string) => {
      store.dispatch("weather/fetchWeatherByCity", city);
    };

    const getCurrentLocation = () => {
      store.dispatch("weather/fetchWeatherByLocation");
    };

    const retry = () => {
      if (weather.value.city) {
        searchCity(weather.value.city);
      } else {
        getCurrentLocation();
      }
    };

    onMounted(() => {
      store.dispatch("theme/initTheme");

      searchCity("Athens");
    });

    return {
      isDarkMode,
      weather,
      loading,
      error,
      searchCity,
      getCurrentLocation,
      retry,
    };
  },
});
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;

  &.dark-mode {
    background-color: #1a1a1a;
  }

  .container {
    max-width: 1200px;
  }

  .weather-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .grid-row {
      display: flex;
      gap: 1rem;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .top-section {
      .header,
      .current {
        height: fit-content;
      }

      .details {
        width: 33%;
        @media (max-width: 768px) {
          width: 100%;
        }
      }
    }
    .bottom-section {
      flex-direction: row;
    }

    .grid-item {
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background-color: white;

      .dark-mode & {
        background-color: #2d2d2d;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .loading-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #3498db;
      animation: spin 1s linear infinite;
    }

    p {
      margin-top: 1rem;
      color: #333;
    }

    .dark-mode & {
      p {
        color: #fff;
      }
    }
  }

  .error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;

    p {
      color: #e74c3c;
      margin-bottom: 1rem;
    }

    .retry-button {
      padding: 0.5rem 1rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #2980b9;
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
