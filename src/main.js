import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import myMixins from "./plugins/myMixins";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
Vue.config.productionTip = false;
Vue.use(myMixins);
Vue.prototype.axios = axios;
Vue.prototype.moment = moment;
Vue.prototype.Swal = Swal;
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
