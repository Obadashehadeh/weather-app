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

        <button type="submit" class="submit-button">
          {{ isLogin ? "Login" : "Register" }}
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

export default defineComponent({
  name: "LoginForm",
  setup() {
    const store = useStore();
    const email = ref("");
    const password = ref("");
    const isLogin = ref(true);
    const showPassword = ref(false);

    const isDarkMode = computed(() => store.state.theme.darkMode);

    const toggleTheme = () => {
      store.dispatch("theme/toggleDarkMode");
    };

    const handleSubmit = () => {
      console.log("Form submitted", {
        mode: isLogin.value ? "login" : "register",
        email: email.value,
        password: password.value,
      });

      store.commit("auth/SET_USER", {
        email: email.value,
        name: email.value.split("@")[0],
      });

      router.push("/home");
    };

    return {
      email,
      password,
      isLogin,
      showPassword,
      isDarkMode,
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
