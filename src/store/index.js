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
    monitoring_data: {},
    isShow: false,
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
    STORE_MONITORING: (state, payload) => {
      state.monitoring_data = payload;
    },
    HIDE_APP: (state, payload) => {
      state.isShow = payload;
    },
  },
  actions: {},
  modules: {},
});
