<template>
  <div class="user-profile" :class="{ 'dark-mode': isDarkMode }">
    <div class="profile-header">
      <div class="user-info">
        <div class="avatar">{{ initials }}</div>
        <div class="user-details">
          <h3 class="user-name">{{ user.name }}</h3>
          <p class="user-email">{{ user.email }}</p>
        </div>
      </div>
      <button @click="logout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>

    <div class="saved-locations">
      <h3 class="section-title">Saved Locations</h3>
      <div class="location-list">
        <div
          v-for="(location, index) in savedLocations"
          :key="index"
          class="location-item"
        >
          <div class="location-name">{{ location }}</div>
          <button @click="selectLocation(location)" class="select-button">
            <i class="fas fa-location-arrow"></i>
          </button>
          <button @click="removeLocation(index)" class="remove-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div v-if="savedLocations.length === 0" class="empty-state">
          No saved locations yet. Search for a city to save it.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "UserProfile",
  emits: ["selectLocation"],
  setup(_, { emit }) {
    const store = useStore();

    const user = computed(() => store.getters["auth/currentUser"]);
    const isDarkMode = computed(() => store.state.theme.darkMode);
    const savedLocations = computed(() => {
      return store.state.weather.savedLocations || [];
    });

    const initials = computed(() => {
      if (user.value && user.value.name) {
        return user.value.name.substring(0, 2).toUpperCase();
      }
      return "U";
    });

    const logout = () => {
      store.dispatch("auth/logout");
    };

    const selectLocation = (location: string) => {
      emit("selectLocation", location);
    };

    const removeLocation = (index: number) => {
      store.dispatch("weather/removeSavedLocation", index);
    };

    return {
      user,
      isDarkMode,
      savedLocations,
      initials,
      logout,
      selectLocation,
      removeLocation,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-profile {
  background-color: rgba(200, 200, 200, 0.9);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &.dark-mode {
    background-color: rgba(44, 44, 44, 0.9);
    color: #fff;
  }

  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        width: 3rem;
        height: 3rem;
        background-color: #4cd964;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 1.25rem;
      }

      .user-details {
        .user-name {
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 0.25rem;
        }

        .user-email {
          font-size: 0.875rem;
          opacity: 0.7;
        }
      }
    }

    .logout-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #f8f9fa;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background-color: #e9ecef;
      }

      .dark-mode & {
        background-color: #4a5568;
        color: white;

        &:hover {
          background-color: #2d3748;
        }
      }
    }
  }

  .saved-locations {
    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .location-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .location-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        background-color: #f8f9fa;
        border-radius: 0.5rem;

        .dark-mode & {
          background-color: #4a5568;
        }

        .location-name {
          flex: 1;
          font-weight: 500;
        }

        .select-button,
        .remove-button {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-left: 0.5rem;
        }

        .select-button {
          background-color: #4cd964;
          color: white;

          &:hover {
            background-color: #3cb853;
          }
        }

        .remove-button {
          background-color: #ff3b30;
          color: white;

          &:hover {
            background-color: #e6352b;
          }
        }
      }

      .empty-state {
        padding: 1.5rem;
        text-align: center;
        background-color: #f8f9fa;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        color: #6c757d;

        .dark-mode & {
          background-color: #4a5568;
          color: #cbd5e0;
        }
      }
    }
  }
}
</style>
