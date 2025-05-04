import { Module } from "vuex";
import { RootState } from "@/store";

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email?: string;
    name?: string;
  } | null;
}

const authModule: Module<AuthState, RootState> = {
  namespaced: true,

  state: {
    isAuthenticated: false,
    user: null,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    },
  },

  actions: {
    login({ commit }, { email, password }) {
      const user = {
        email,
        name: email.split("@")[0],
      };

      commit("SET_USER", user);
      return Promise.resolve(user);
    },

    logout({ commit }) {
      commit("SET_USER", null);
      return Promise.resolve();
    },

    checkAuth({ commit }) {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          commit("SET_USER", user);
        } catch (e) {
          localStorage.removeItem("user");
        }
      }
    },
  },

  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
  },
};

export default authModule;
