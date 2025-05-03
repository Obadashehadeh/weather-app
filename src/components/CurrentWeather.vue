<template>
  <div class="current-weather" :class="{ 'dark-mode': isDarkMode }">
    <div class="temperature-container">
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
    </div>
    <div class="weather-condition text-2xl font-medium text-center mt-4">
      {{ condition }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "CurrentWeather",
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
.current-weather {
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

  .temperature-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
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

  .weather-condition {
    margin-top: auto;
  }
}
</style>
