<template>
  <div class="hourly-forecast" :class="{ 'dark-mode': isDarkMode }">
    <h2 class="text-lg font-semibold mb-4">Hourly Forecast:</h2>
    <div class="forecast-list">
      <div
        v-for="(hour, index) in forecastData"
        :key="index"
        class="forecast-item"
        :class="{
          active: hour.active,
          daytime:
            hour.condition === 'Sunny' || hour.condition === 'Partly Cloudy',
          nighttime: hour.condition === 'Clear',
          cloudy: hour.condition === 'Cloudy',
          rainy: hour.condition === 'Rainy' || hour.condition === 'Showers',
        }"
      >
        <div class="forecast-item-inner">
          <div class="forecast-time">{{ hour.time }}</div>
          <div class="forecast-icon">
            <div
              v-if="hour.condition === 'Sunny'"
              class="w-10 h-10 bg-yellow-400 rounded-full mx-auto"
            ></div>
            <div
              v-else-if="hour.condition === 'Partly Cloudy'"
              class="w-10 h-10 bg-gray-300 rounded-full mx-auto"
            ></div>
            <div
              v-else
              class="w-10 h-10 bg-blue-300 rounded-full mx-auto"
            ></div>
          </div>
          <div class="forecast-temp">{{ hour.temperature }}°C</div>
          <div class="forecast-wind">{{ hour.windSpeed }}km/h</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

interface ForecastHour {
  time: string;
  temperature: number | string;
  condition: string;
  windSpeed: number | string;
  active?: boolean;
}

export default defineComponent({
  name: "HourlyForecast",
  props: {
    forecastData: {
      type: Array as () => ForecastHour[],
      default: () => [
        {
          time: "12:00",
          temperature: 26,
          condition: "Sunny",
          windSpeed: 3,
          active: true,
        },
        { time: "15:00", temperature: 27, condition: "Sunny", windSpeed: 2 },
        {
          time: "18:00",
          temperature: 27,
          condition: "Partly Cloudy",
          windSpeed: 2,
        },
        { time: "21:00", temperature: 25, condition: "Rainy", windSpeed: 3 },
        { time: "00:00", temperature: 22, condition: "Sunny", windSpeed: 3 },
      ],
    },
  },
  setup() {
    const store = useStore();

    const isDarkMode = computed(() => store.state.theme?.darkMode || false);

    return {
      isDarkMode,
    };
  },
});
</script>

<style lang="scss" scoped>
.hourly-forecast {
  padding: 1rem;
  border-radius: 1rem;
  background-color: rgba(200, 200, 200, 0.9);
  color: #333;
  height: 366px;

  &.dark-mode {
    background-color: rgba(44, 44, 44, 0.9);
    color: #fff;
  }

  .forecast-list {
    display: flex;
    overflow-x: auto;
    padding: 0.5rem 0;
    gap: 1rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    justify-content: space-between;
    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
    }

    .forecast-item {
      flex: 1;
      min-width: 70px;
      max-width: 100px;
      text-align: center;
      border-radius: 1rem;
      padding: 0.75rem 0.5rem;
      transition: all 0.3s ease;
      height: 17rem;
      background-color: #e0e0e0;
      color: #333;

      &.daytime {
        background-color: #ffb74d;
      }

      &.nighttime {
        background-color: #5c6bc0;
        color: white;
      }

      &.cloudy {
        background-color: #b0bec5;
      }

      &.rainy {
        background-color: #64b5f6;
        color: white;
      }

      .dark-mode & {
        &.daytime {
          background-color: #e65100;
          color: white;
        }

        &.nighttime {
          background-color: #303f9f;
          color: white;
        }

        &.cloudy {
          background-color: #546e7a;
          color: white;
        }

        &.rainy {
          background-color: #1976d2;
          color: white;
        }
      }

      .forecast-item-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        justify-content: space-around;
        height: -webkit-fill-available;
      }

      .forecast-time {
        font-weight: 600;
      }

      .forecast-temp {
        font-weight: 500;
      }

      .forecast-wind {
        font-size: 0.75rem;
        opacity: 0.8;
      }
    }
  }
}
</style>
