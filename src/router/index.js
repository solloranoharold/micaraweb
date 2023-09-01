import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import AccountView from "../components/Accounts/AccountsVue";
import MonitoringView from "../components/Monitoring/MonitoringVue";
import ReportsView from "../components/Reports/ReportsVue";
// import store from "store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
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

// router.beforeEach((to, from, next) => {
//   if(to.path == '/login'){
//     if(store.state.userInfo){
//       if( store.state.userInfo.type=='ADMIN' ){
//         next('/')
//       }else{
//         //
//       }
//     }else{
//       next()
//     }
//   }else{
//     if(store.state.userInfo){
//       if( store.state.userInfo.type=='ADMIN' ){
//         next('/')
//       }else{
//         //
//       }
//     }else{
//       next('/login')
//     }
//   }

// })

export default router;
