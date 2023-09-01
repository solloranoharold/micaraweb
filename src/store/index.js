import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    isHide: false,
    userInfo: null,
    datas: null,
  },
  getters: {},
  mutations: {
    STORE_USERINFO: (state, payload) => {
      state.userInfo = payload;
    },
    STORE_DATA: (state, payload) => {
      state.datas = payload;
    },
    HIDE: (state, payload) => {
      state.isHide = payload;
    },
  },
  actions: {},
  modules: {},
});
