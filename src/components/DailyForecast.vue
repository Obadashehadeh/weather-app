<!-- src/components/DailyForecast.vue -->
<template>
  <div class="daily-forecast" :class="{ 'dark-mode': isDarkMode }">
    <h2 class="text-lg font-semibold mb-4">5 Days Forecast:</h2>
    <div class="forecast-list">
      <div
        v-for="(day, index) in forecastData"
        :key="index"
        class="forecast-item"
      >
        <div class="weather-icon">
          <img :src="day.iconUrl" :alt="day.condition" class="w-10 h-10" />
        </div>
        <div class="forecast-day-info">
          <div class="day-name">{{ day.day }}, {{ day.date }}</div>
          <div class="day-temp">{{ day.temperature }}°C</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

interface ForecastDay {
  day: string;
  date: string;
  temperature: number | string;
  condition: string;
  iconUrl: string;
}

export default defineComponent({
  name: "DailyForecast",
  props: {
    forecastData: {
      type: Array as () => ForecastDay[],
      default: () => [],
    },
  },
  setup() {
    const store = useStore();
    const isDarkMode = computed(() => store.state.theme.darkMode || false);

    return {
      isDarkMode,
    };
  },
});
</script>

<style lang="scss" scoped>
.daily-forecast {
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: rgba(200, 200, 200, 0.9);
  color: #333;
  height: 100%;
  &.dark-mode {
    background-color: rgba(44, 44, 44, 0.9);
    color: #fff;
  }

  .forecast-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-around;
    .forecast-item {
      display: flex;
      align-items: center;
      gap: 1rem;

      .weather-icon {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .forecast-day-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;

        .day-temp {
          font-weight: 600;
          font-size: 1.125rem;
        }

        .day-name {
          font-size: 0.875rem;
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
