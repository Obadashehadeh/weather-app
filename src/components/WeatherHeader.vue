<template>
  <div class="weather-header w-lg" :class="{ 'dark-mode': isDarkMode }">
    <div class="city-container">
      <h1 class="text-3xl font-bold mb-2">{{ city }}</h1>
    </div>
    <div class="time-container">
      <div class="text-6xl font-bold">{{ currentTime }}</div>
      <div class="text-sm mt-1">{{ currentDate }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "WeatherHeader",
  props: {
    city: {
      type: String,
      default: "Athens",
    },
  },
  setup() {
    const store = useStore();
    const now = ref(new Date());
    const timeInterval = ref<number | null>(null);

    onMounted(() => {
      timeInterval.value = window.setInterval(() => {
        now.value = new Date();
      }, 1000);
    });

    onUnmounted(() => {
      if (timeInterval.value) {
        clearInterval(timeInterval.value);
      }
    });

    const currentTime = computed(() => {
      const hours = now.value.getHours().toString().padStart(2, "0");
      const minutes = now.value.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    const currentDate = computed(() => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "short",
      };
      return now.value.toLocaleDateString("en-US", options);
    });
    const isDarkMode = computed(() => store.state.theme?.darkMode || false);

    return {
      currentTime,
      currentDate,
      isDarkMode,
    };
  },
});
</script>

<style lang="scss" scoped>
.weather-header {
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.dark-mode {
    background-color: rgba(30, 30, 30, 0.9);
    color: #fff;
  }

  .city-container {
    margin-bottom: 0.5rem;
  }

  .time-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
    align-items: center;
  }

  .sun-info {
    display: flex;
    justify-content: space-around;
    margin-top: auto;

    .sun-time {
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon {
        margin-right: 0.25rem;
        font-size: 1rem;
      }

      .time {
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: 0.25rem;
      }
    }
  }
}
</style>
