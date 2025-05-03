import { createStore } from "vuex";
import themeModule from "./modules/theme";
import weatherModule from "./modules/weather";

export interface RootState {
  version: string;
}

export default createStore<RootState>({
  state: {
    version: "1.0.0",
  },
  getters: {
    // Root getters (if any)
  },
  mutations: {
    // Root mutations (if any)
  },
  actions: {
    // Root actions (if any)
  },
  modules: {
    theme: themeModule,
    weather: weatherModule,
  },
});
