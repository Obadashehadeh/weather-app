import { Module } from "vuex";
import { RootState } from "@/store";

export interface ThemeState {
  darkMode: boolean;
}

const themeModule: Module<ThemeState, RootState> = {
  namespaced: true,

  state: {
    darkMode: false,
  },

  mutations: {
    SET_DARK_MODE(state, value: boolean) {
      state.darkMode = value;
    },
  },

  actions: {
    toggleDarkMode({ commit, state }) {
      commit("SET_DARK_MODE", !state.darkMode);

      localStorage.setItem("darkMode", !state.darkMode ? "true" : "false");
    },

    initTheme({ commit }) {
      const savedTheme = localStorage.getItem("darkMode");
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (savedTheme) {
        commit("SET_DARK_MODE", savedTheme === "true");
      } else if (prefersDarkMode) {
        commit("SET_DARK_MODE", true);
      }
    },
  },

  getters: {
    isDarkMode: (state) => state.darkMode,
  },
};

export default themeModule;
