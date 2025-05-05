<template>
  <div
    class="weather-details h-full w-full space-x-4"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <div class="flex justify-between items-start">
      <div class="temperature-display">
        <div class="text-5xl md:text-6xl lg:text-7xl font-bold">
          {{ temperature }}°C
        </div>
        <div class="text-xs md:text-sm">Feels like: {{ feelsLike }}°C</div>
        <div class="text-center flex flex-col items-center">
          <div class="text-xs uppercase opacity-70 mb-1">Sunrise</div>
          <div class="text-sm md:text-base font-medium">
            {{ sunriseTime }}
          </div>
        </div>

        <div class="text-center flex flex-col items-center">
          <div class="text-xs uppercase opacity-70 mb-1">Sunset</div>
          <div class="text-sm md:text-base font-medium">{{ sunsetTime }}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-between weather-icon">
      <div
        class="sun-icon"
        v-if="condition === 'Clear' || condition === 'Sunny'"
      >
        <div
          class="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 bg-yellow-400 rounded-full flex items-center justify-center"
        >
          <div class="rays"></div>
        </div>
      </div>
      <div
        v-else-if="condition === 'Clouds' || condition === 'Partly Cloudy'"
        class="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 bg-gray-300 rounded-full"
      ></div>
      <div
        v-else-if="
          condition === 'Rain' ||
          condition === 'Rainy' ||
          condition === 'Drizzle'
        "
        class="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 bg-blue-300 rounded-full"
      ></div>
      <div
        v-else
        class="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 bg-gray-300 rounded-full"
      ></div>
      <div
        class="weather-condition text-xl md:text-2xl font-medium text-center mb-6"
      >
        {{ condition }}
      </div>
    </div>
    <div class="grid grid-cols-2 items-end">
      <!-- Humidity -->
      <div class="text-center">
        <div class="text-lg md:text-xl lg:text-2xl font-bold">
          {{ humidity }}%
        </div>
        <div class="text-xs md:text-sm opacity-70">Humidity</div>
      </div>

      <!-- Wind Speed -->
      <div class="text-center">
        <div class="text-lg md:text-xl lg:text-2xl font-bold">
          {{ windSpeed }}km/h
        </div>
        <div class="text-xs md:text-sm opacity-70">Wind Speed</div>
      </div>

      <!-- Pressure -->
      <div class="text-center">
        <div class="text-lg md:text-xl lg:text-2xl font-bold">
          {{ pressure }}hPa
        </div>
        <div class="text-xs md:text-sm opacity-70">Pressure</div>
      </div>

      <!-- UV Index -->
      <div class="text-center">
        <div class="text-lg md:text-xl lg:text-2xl font-bold">
          {{ uvIndex }}
        </div>
        <div class="text-xs md:text-sm opacity-70">UV</div>
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
    temperature: {
      type: [Number, String],
      default: 24,
    },
    feelsLike: {
      type: [Number, String],
      default: 22,
    },
    condition: {
      type: String,
      default: "Sunny",
    },
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
  background-color: rgba(200, 200, 200, 0.9);
  color: #333;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  &.dark-mode {
    background-color: rgba(44, 44, 44, 0.9);
    color: #fff;
  }
  .temperature-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: -webkit-fill-available;
    justify-content: space-between;
  }
  .sun-icon {
    position: relative;

    .rays {
      position: absolute;
      top: -15px;
      left: -15px;
      right: -15px;
      bottom: -15px;

      &:before,
      &:after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        background: #facc15;
      }
    }
  }
}
</style>
