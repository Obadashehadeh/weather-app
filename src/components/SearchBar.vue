<template>
  <div class="search-bar" :class="{ 'dark-mode': isDarkMode }">
    <div class="theme-toggle-container">
      <button
        class="theme-toggle"
        :class="{ 'dark-mode': isDarkMode }"
        @click="toggleTheme"
      >
        <div class="toggle-switch">
          <div class="toggle-indicator"></div>
        </div>
        <span class="sr-only">{{
          isDarkMode ? "Light Mode" : "Dark Mode"
        }}</span>
      </button>
      <span class="mode-text">{{
        isDarkMode ? "Light Mode" : "Dark Mode"
      }}</span>
    </div>
    <div class="search-input-container">
      <input
        type="text"
        class="search-input"
        placeholder="Search for your preferred city..."
        v-model="searchQuery"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        <i class="fa-solid fa-magnifying-glass fa-3xs"></i>
      </button>
    </div>
    <button class="location-button" @click="getCurrentLocation">
      <span>Current Location</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "SearchBar",
  emits: ["search", "getCurrentLocation"],
  setup(_, { emit }) {
    const store = useStore();
    const searchQuery = ref("");

    const isDarkMode = computed(() => store.state.theme?.darkMode || false);

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        emit("search", searchQuery.value);
        searchQuery.value = "";
      }
    };

    const getCurrentLocation = () => {
      emit("getCurrentLocation");
    };

    const toggleTheme = () => {
      store.dispatch("theme/toggleDarkMode");
    };
    return {
      searchQuery,
      handleSearch,
      getCurrentLocation,
      isDarkMode,
      toggleTheme,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  gap: 3.75rem;
  margin-bottom: 1rem;
  width: 100%;

  &.dark-mode {
    .search-input {
      background-color: rgba(50, 50, 50, 0.9);
      color: #fff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .search-button,
    .location-button {
      background-color: rgba(70, 70, 70, 0);
      color: #fff;

      //&:hover {
      //  background-color: rgba(90, 90, 90, 0.9);
      //}
    }
  }

  .search-input-container {
    position: relative;
    flex: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 3rem;
    padding-right: 2.5rem;
    border-radius: 2rem;
    border: none;
    background-color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    outline: none;
    transition: box-shadow 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:focus {
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
    }
  }

  .search-button {
    position: absolute;
    left: 1.5rem;
    top: 45%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    opacity: 1.7;
    i {
      color: #e5e7eb;
    }
    &:hover {
      opacity: 1;
    }
  }

  .location-button {
    padding: 0.75rem 1rem;
    border-radius: 2rem;
    border: none;
    background-color: #4cd964;
    color: white;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: #3cb853;
    }

    .dark-mode & {
      background-color: #3cb853;

      &:hover {
        background-color: #2a8f3c;
      }
    }
  }

  .theme-toggle-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-direction: column;
    .theme-toggle {
      width: 4rem;
      height: 1.5rem;
      border-radius: 0.75rem;
      background-color: #e0e0e0;
      border: none;
      cursor: pointer;
      padding: 0.125rem;
      transition: background-color 0.3s ease;

      &.dark-mode {
        background-color: #2196f3;
      }

      .toggle-switch {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .toggle-indicator {
        position: absolute;
        top: 0;
        left: 0;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;

        .dark-mode & {
          transform: translateX(2.5rem);
        }
      }
    }

    .mode-text {
      font-size: 0.75rem;
      font-weight: 500;
      color: #666;

      .dark-mode & {
        color: #fff;
      }
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  }
}
</style>
