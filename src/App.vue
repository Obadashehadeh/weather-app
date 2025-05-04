<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore();
    const isDarkMode = computed(() => store.state.theme?.darkMode || false);

    return {
      isDarkMode,
    };
  },
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Roboto", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
  background: linear-gradient(124deg, #d9d9d9, #292929);

  &.dark-mode {
    background: linear-gradient(135deg, #444444, #111111);
    color: #f5f5f5;
  }
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-4 {
  margin-top: 1rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.text-4xl {
  font-size: 2.25rem;
}

.text-6xl {
  font-size: 3.75rem;
}

.text-7xl {
  font-size: 4.5rem;
}

.text-8xl {
  font-size: 6rem;
}

.text-center {
  text-align: center;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.w-6 {
  width: 1.5rem;
}

.h-6 {
  height: 1.5rem;
}

.w-10 {
  width: 2.5rem;
}

.h-10 {
  height: 2.5rem;
}

.w-24 {
  width: 6rem;
}

.h-24 {
  height: 6rem;
}

.w-28 {
  width: 7rem;
}

.h-28 {
  height: 7rem;
}

.bg-yellow-400 {
  background-color: #facc15;
}

.bg-gray-300 {
  background-color: #d1d5db;
}

.bg-blue-300 {
  background-color: #93c5fd;
}

.rounded-full {
  border-radius: 9999px;
}
.w-lg {
  width: 32rem;
}
</style>
