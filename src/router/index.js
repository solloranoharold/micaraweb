import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import AccountView from "../components/Accounts/AccountsVue";
import MonitoringView from "../components/Monitoring/MonitoringVue";
import ReportsView from "../components/Reports/ReportsVue";
import PDFVue from "../components/Reports/PDFVue";
import LoginView from "../components/LoginVue.vue";
import HomeOwner from "../components/HomeOwnerVue.vue";
import TransactionVue from "../components/Monitoring/TransactionsVue";
import store from "../store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/accounts",
    name: "Accounts",
    component: AccountView,
  },
  {
    path: "/monitoring",
    name: "Monitoring",
    component: MonitoringView,
  },
  {
    path: "/reports",
    name: "Reports",
    component: ReportsView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/homeowner",
    name: "HomeOwner",
    component: HomeOwner,
  },
  {
    path: "/transaction",
    name: "TransactionVue",
    component: TransactionVue,
  },
  {
    path: "/pdfvue/:date1/:date2",
    name: "PDFVue",
    component: PDFVue,
    props: true,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    if (store.state.userInfo != null) {
      next("/monitoring");
    } else {
      next();
    }
  } else if (to.path != "/transaction") {
    if (store.state.userInfo != null) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
