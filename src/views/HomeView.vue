<template>
  <div class="home" :class="{ 'dark-mode': isDarkMode }">
    <div class="container mx-auto px-4 py-6">
      <div class="search-container mb-4">
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
        <div class="grid-row header-row">
          <div class="grid-item header">
            <WeatherHeader
              :city="weather.city"
              :sunrise-time="weather.sunrise"
              :sunset-time="weather.sunset"
            />
          </div>
          <div class="grid-item details w-full">
            <WeatherDetails
              :temperature="weather.temperature"
              :feels-like="weather.feelsLike"
              :condition="weather.condition"
              :icon-url="weather.iconUrl"
              :sunrise-time="weather.sunrise"
              :sunset-time="weather.sunset"
              :humidity="weather.humidity"
              :wind-speed="weather.windSpeed"
              :pressure="weather.pressure"
              :uv-index="weather.uvIndex"
            />
          </div>
        </div>

        <div class="grid-row forecast-row">
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
import { defineComponent, computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import WeatherHeader from "@/components/WeatherHeader.vue";
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
    const initialLoadDone = ref(false);

    const isDarkMode = computed(() => store.state.theme.darkMode);
    const isAuthenticated = computed(
      () => store.getters["auth/isAuthenticated"]
    );

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

    onMounted(async () => {
      if (initialLoadDone.value) {
        return;
      }

      store.dispatch("theme/initTheme");
      store.dispatch("auth/checkAuth");

      if (isAuthenticated.value) {
        try {
          await store.dispatch("weather/fetchSavedLocations");
        } catch (error) {
          // Handle error silently
        }
      }

      searchCity("Athens");
      initialLoadDone.value = true;
    });

    return {
      isDarkMode,
      isAuthenticated,
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
  transition: background-color 0.3s ease;

  &.dark-mode {
    background-color: transparent;
  }

  .container {
    max-width: 1200px;

    @media (min-width: 768px) {
      padding-top: 2rem;
    }
  }

  .search-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .weather-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 1000px;
    margin: 0 auto;

    .grid-row {
      display: flex;
      gap: 1.5rem;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .header-row {
      .header {
        flex: 2;
        height: 330px;
      }

      .details {
        flex: 3;
      }
    }

    .forecast-row {
      .daily {
        flex: 1;
        height: 366px;
      }

      .hourly {
        flex: 2;
        height: 366px;
      }
    }

    .grid-item {
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }

      .dark-mode & {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .loading-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    max-width: 1000px;
    margin: 0 auto;

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
    max-width: 1000px;
    margin: 0 auto;

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
      transition: background-color 0.2s;

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
