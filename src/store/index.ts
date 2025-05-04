import { createStore } from "vuex";
import themeModule from "./modules/theme";
import weatherModule from "./modules/weather";
import authModule from "./modules/auth";

export interface RootState {
  version: string;
}

export default createStore<RootState>({
  state: {
    version: "1.0.0",
  },
  getters: {},
  mutations: {},
  actions: {
    initApp({ dispatch }) {
      dispatch("theme/initTheme");
      dispatch("auth/checkAuth");
    },
  },
  modules: {
    theme: themeModule,
    weather: weatherModule,
    auth: authModule,
  },
});
