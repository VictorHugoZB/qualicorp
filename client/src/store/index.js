import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: localStorage.username || null,
    token: localStorage.token || null,
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {},
  getters: {
    async isLoggedIn(state) {
      const res = await axios.post(
        "/validate-login",
        {},
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      return res.data.logged;
    },
    getUsername(state) {
      return state.username || "";
    },
  },
});
