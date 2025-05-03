<template>
  <div class="weather-details" :class="{ 'dark-mode': isDarkMode }">
    <div class="temperature-display">
      <div class="text-7xl font-bold">{{ temperature }}°C</div>
      <div class="text-sm">Feels like: {{ feelsLike }}°C</div>
    </div>
    <div class="weather-icon">
      <div class="sun-icon" v-if="condition === 'Sunny'">
        <div
          class="w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center"
        >
          <div class="rays"></div>
        </div>
      </div>
      <div v-else class="w-28 h-28 bg-gray-300 rounded-full"></div>
    </div>
    <div class="weather-condition text-2xl font-medium text-center mt-4">
      {{ condition }}
    </div>
    <div class="details-header">Weather Details</div>

    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-value">{{ humidity }}%</div>
        <div class="detail-label">Humidity</div>
      </div>

      <div class="detail-item">
        <div class="detail-value">{{ windSpeed }}km/h</div>
        <div class="detail-label">Wind Speed</div>
      </div>

      <div class="detail-item">
        <div class="detail-value">{{ pressure }}hPa</div>
        <div class="detail-label">Pressure</div>
      </div>

      <div class="detail-item">
        <div class="detail-value">{{ uvIndex }}</div>
        <div class="detail-label">UV</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "WeatherDetails",
  props: {
    sunriseTime: {
      type: String,
      default: "06:37 AM",
    },
    sunsetTime: {
      type: String,
      default: "20:37 PM",
    },
    humidity: {
      type: [Number, String],
      default: 41,
    },
    windSpeed: {
      type: [Number, String],
      default: 2,
    },
    pressure: {
      type: [Number, String],
      default: 997,
    },
    uvIndex: {
      type: [Number, String],
      default: 8,
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
.weather-details {
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  height: 100%;
  display: flex;
  flex-direction: column;

  &.dark-mode {
    background-color: rgba(30, 30, 30, 0.9);
    color: #fff;
  }

  .details-header {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 2rem;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1rem;

    .detail-item {
      text-align: center;

      .detail-value {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .detail-label {
        font-size: 0.875rem;
        opacity: 0.7;
      }
    }
  }
}
</style>
