import { Module } from "vuex";
import { RootState } from "@/store";
import AuthService from "@/services/AuthService";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    email?: string;
    name?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const authModule: Module<AuthState, RootState> = {
  namespaced: true,

  state: {
    isAuthenticated: !!AuthService.getToken(),
    user: AuthService.getCurrentUser(),
    loading: false,
    error: null,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
  },

  actions: {
    async login({ commit }, { email, password }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");

        const response = await AuthService.login(email, password);
        commit("SET_USER", response.user);
        commit("SET_LOADING", false);

        return response;
      } catch (error) {
        commit("SET_LOADING", false);

        const axiosError = error as AxiosError<any>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Authentication failed. Please check your credentials.";
        commit("SET_ERROR", errorMessage);

        throw error;
      }
    },

    async register({ commit }, { name, email, password }) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");

        const response = await AuthService.register(name, email, password);
        commit("SET_USER", response.user);
        commit("SET_LOADING", false);

        return response;
      } catch (error) {
        commit("SET_LOADING", false);

        const axiosError = error as AxiosError<ApiErrorResponse>;
        const errorMessage =
          axiosError.response?.data?.message ||
          "Registration failed. Please try again.";
        commit("SET_ERROR", errorMessage);

        throw error;
      }
    },

    logout({ commit }) {
      AuthService.logout();
      commit("SET_USER", null);
    },

    checkAuth({ commit }) {
      const user = AuthService.getCurrentUser();
      commit("SET_USER", user);
    },
  },

  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    error: (state) => state.error,
  },
};

export default authModule;
