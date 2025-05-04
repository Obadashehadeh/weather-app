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
          <div v-if="day.condition === 'Sunny'" class="icon-sunny"></div>
          <div
            v-else-if="day.condition === 'Partly Cloudy'"
            class="icon-partly-cloudy"
          ></div>
          <div v-else class="icon-rainy"></div>
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
}

export default defineComponent({
  name: "DailyForecast",
  props: {
    forecastData: {
      type: Array as () => ForecastDay[],
      default: () => [
        {
          day: "Friday",
          date: "1 Sep",
          temperature: 20,
          condition: "Partly Cloudy",
        },
        { day: "Saturday", date: "2 Sep", temperature: 22, condition: "Sunny" },
        { day: "Sunday", date: "3 Sep", temperature: 27, condition: "Sunny" },
        { day: "Monday", date: "4 Sep", temperature: 18, condition: "Rainy" },
        { day: "Tuesday", date: "5 Sep", temperature: 16, condition: "Rainy" },
      ],
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

        .icon-sunny {
          width: 2rem;
          height: 2rem;
          background-color: #facc15;
          border-radius: 50%;
        }

        .icon-partly-cloudy {
          width: 2rem;
          height: 2rem;
          background-color: #d1d5db;
          border-radius: 50%;
        }

        .icon-rainy {
          width: 2rem;
          height: 2rem;
          background-color: #93c5fd;
          border-radius: 50%;
        }
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
