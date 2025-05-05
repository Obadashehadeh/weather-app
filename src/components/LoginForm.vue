<template>
  <div class="login-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="login-card">
      <div class="login-header">
        <h2>{{ isLogin ? "Login" : "Register" }}</h2>
        <div class="theme-toggle">
          <button @click="toggleTheme" class="toggle-button">
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="!isLogin" class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            required
            placeholder="Enter your name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="password-toggle"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="submit-button" :disabled="loading">
          <span v-if="loading">
            <i class="fas fa-spinner fa-spin"></i> Processing...
          </span>
          <span v-else>
            {{ isLogin ? "Login" : "Register" }}
          </span>
        </button>
      </form>

      <div class="form-footer">
        <button @click="isLogin = !isLogin" class="toggle-mode">
          {{
            isLogin ? "Need to create an account?" : "Already have an account?"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import { AxiosError } from "axios";
import bcrypt from "bcryptjs";

export default defineComponent({
  name: "LoginForm",
  setup() {
    const store = useStore();
    const email = ref("");
    const password = ref("");
    const name = ref("");
    const isLogin = ref(true);
    const showPassword = ref(false);
    const errorMessage = ref("");

    const isDarkMode = computed(() => store.state.theme.darkMode);
    const loading = computed(() => store.state.auth.loading);

    const toggleTheme = () => {
      store.dispatch("theme/toggleDarkMode");
    };

    const handleSubmit = async () => {
      try {
        // eslint-disable-next-line no-debugger
        debugger;
        errorMessage.value = "";

        if (isLogin.value) {
          await store.dispatch("auth/login", {
            email: email.value,
            password: password.value,
          });
        } else {
          await store.dispatch("auth/register", {
            name: name.value,
            email: email.value,
            password: password.value,
          });
        }

        await store.dispatch("weather/fetchSavedLocations");

        router.push("/home");
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        errorMessage.value =
          axiosError.response?.data?.message ||
          (typeof axiosError.response?.data === "string"
            ? axiosError.response.data
            : null) ||
          "Authentication failed. Please check your credentials.";
      }
    };

    return {
      email,
      password,
      name,
      isLogin,
      showPassword,
      isDarkMode,
      errorMessage,
      loading,
      toggleTheme,
      handleSubmit,
    };
  },
});
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #abb3b5, #181f20);
  transition: all 0.3s ease;

  &.dark-mode {
    background: linear-gradient(86deg, #000000, #131a1d);
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    background-color: rgba(200, 200, 200, 0.9);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    .dark-mode & {
      background-color: rgba(44, 44, 44, 0.9);
      color: #fff;
    }
  }

  .login-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .toggle-button {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #333;

      .dark-mode & {
        color: #fff;
      }
    }
  }

  .error-message {
    background-color: rgba(255, 0, 0, 0.1);
    color: #d9534f;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .login-form {
    .form-group {
      margin-bottom: 1.25rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid #e0e0e0;
        background-color: white;
        font-size: 0.875rem;

        .dark-mode & {
          background-color: #4a5568;
          border-color: #4a5568;
          color: white;

          &::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }

      .password-input {
        position: relative;

        input {
          padding-right: 2.5rem;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          color: #4a5568;

          .dark-mode & {
            color: #e2e8f0;
          }
        }
      }
    }

    .submit-button {
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: none;
      background-color: #4cd964;
      color: white;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background-color: #3cb853;
      }

      &:disabled {
        background-color: #a3e2ad;
        cursor: not-allowed;
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
    }
  }

  .form-footer {
    margin-top: 1.5rem;
    text-align: center;

    .toggle-mode {
      background: none;
      border: none;
      color: #2193b0;
      font-size: 0.875rem;
      cursor: pointer;

      .dark-mode & {
        color: #6dd5ed;
      }
    }
  }
}
</style>
