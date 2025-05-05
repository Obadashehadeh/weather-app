<template>
  <div class="search-bar" :class="{ 'dark-mode': isDarkMode }">
    <div class="theme-toggle-container">
      <button
        class="theme-toggle"
        :class="{ 'dark-mode': isDarkMode }"
        @click="toggleTheme"
      >
        <div class="toggle-switch">
          <div class="toggle-indicator">
            <i
              :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'"
              class="mode-icon"
            ></i>
          </div>
        </div>
      </button>
      <span class="mode-text">{{
        isDarkMode ? "Dark Mode" : "Light Mode"
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
        <i class="fas fa-search"></i>
      </button>
    </div>
    <button class="location-button" @click="getCurrentLocation">
      <i class="fas fa-location-dot"></i>
      <span>Current Location</span>
    </button>
    <button
      v-if="loggedIn"
      class="save-button"
      @click="saveCurrentLocation"
      :disabled="!currentCity"
    >
      <i class="fas fa-bookmark"></i>
      <span>Save Location</span>
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
    const loggedIn = computed(() => store.getters["auth/isAuthenticated"]);
    const currentCity = computed(() => store.state.weather?.city);

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

    const saveCurrentLocation = () => {
      if (currentCity.value) {
        store.dispatch("weather/saveLocation", {
          name: currentCity.value,
          country: "", // Could be enhanced with country data
        });
      }
    };

    return {
      searchQuery,
      handleSearch,
      getCurrentLocation,
      isDarkMode,
      toggleTheme,
      loggedIn,
      currentCity,
      saveCurrentLocation,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }

  &.dark-mode {
    .search-input {
      background-color: rgba(50, 50, 50, 0.9);
      color: #fff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .search-button,
    .location-button,
    .save-button {
      background-color: rgba(70, 70, 70, 0.9);
      color: #fff;

      &:hover:not(:disabled) {
        background-color: rgba(90, 90, 90, 0.9);
      }
    }
  }

  .search-input-container {
    position: relative;
    flex: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-inline: 3rem;
    border-radius: 2rem;
    border: none;
    background-color: rgba(200, 200, 200, 0.9);
    font-size: 0.875rem;
    outline: none;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:focus {
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
    }
  }

  .search-button {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: #4a5568;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  .location-button,
  .save-button {
    padding: 0.75rem 1.25rem;
    border-radius: 2rem;
    border: none;
    background-color: #4cd964;
    color: white;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;

    i {
      font-size: 0.75rem;
    }

    &:hover:not(:disabled) {
      background-color: #3cb853;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      background-color: #a3e2ad;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
      opacity: 0.7;
    }

    .dark-mode & {
      background-color: #3cb853;

      &:hover:not(:disabled) {
        background-color: #2a8f3c;
      }

      &:disabled {
        background-color: #2a6b30;
      }
    }

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }
  }

  .save-button {
    background-color: #2193b0;

    &:hover:not(:disabled) {
      background-color: #1c7a96;
    }

    .dark-mode & {
      background-color: #1c7a96;

      &:hover:not(:disabled) {
        background-color: #146680;
      }
    }
  }

  .theme-toggle-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
    }

    .theme-toggle {
      width: 3.5rem;
      height: 1.75rem;
      border-radius: 0.875rem;
      background-color: #e0e0e0;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      transition: all 0.3s ease;

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
        display: flex;
        align-items: center;
        justify-content: center;

        .dark-mode & {
          transform: translateX(1.75rem);
        }

        .mode-icon {
          font-size: 0.7rem;
          color: #f39c12;

          .dark-mode & {
            color: #3498db;
          }
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
  }
}
</style>
