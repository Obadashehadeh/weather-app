<!-- src/components/HourlyForecast.vue -->
<template>
  <div class="hourly-forecast" :class="{ 'dark-mode': isDarkMode }">
    <h2 class="text-lg font-semibold mb-4">Hourly Forecast:</h2>
    <div class="forecast-list">
      <div
        v-for="(hour, index) in forecastData"
        :key="index"
        class="forecast-item"
        :class="{ active: hour.active }"
      >
        <div class="forecast-item-inner">
          <div class="forecast-time">{{ hour.time }}</div>
          <div class="forecast-icon">
            <img
              :src="hour.iconUrl"
              :alt="hour.condition"
              class="w-10 h-10 mx-auto"
            />
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
  iconUrl: string;
  windSpeed: number | string;
  active?: boolean;
}

export default defineComponent({
  name: "HourlyForecast",
  props: {
    forecastData: {
      type: Array as () => ForecastHour[],
      default: () => [],
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

      &.active {
        background-color: #4cd964;
        color: white;
      }

      .dark-mode & {
        background-color: #333;
        color: #fff;

        &.active {
          background-color: #2a8f3c;
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
