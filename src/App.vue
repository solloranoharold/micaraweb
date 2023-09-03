<template>
  <v-app>
    <v-app-bar
      v-if="isHide == false && userInfo != null"
      app
      dark
      class="teal accent-4"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-5"
          contain
          src="./assets/img/micaraland-logo-final.png"
          transition="scale-transition"
          width="150"
        />
      </div>
    </v-app-bar>
    <!-- NAVBAR -->
    <v-navigation-drawer
      v-if="userInfo != null"
      v-model="drawer"
      app
      fixed
      width="250"
    >
      <div class="d-flex align-center">
        <v-img
          aspect-ratio="1"
          alt="Profile"
          :src="`${ftp}users/${userInfo.profile_img}`"
        ></v-img>
      </div>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ userInfo.fullname }}</v-list-item-title
            >
            <v-list-item-subtitle>{{ userInfo.position }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group
          active-class="teal accent-2 --text text--accent-2"
          v-if="userInfo.position == 'Administrator'"
        >
          <v-list-item v-for="(item, i) in admin" :key="i" :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group
          active-class="teal accent-2 --text text--accent-2"
          v-if="userInfo.position == 'Security Guard'"
        >
          <v-list-item v-for="(item, i) in guard" :key="i" :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <v-list nav dense>
          <v-list-item-group active-class="teal accent-2 --text text--accent-2">
            <v-list-item prepend-icon="mdi-account-circle">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My Account</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout()">
              <v-list-item-icon>
                <v-icon>mdi-power</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  watch: {
    isHide(val) {
      this.drawer = !val;
    },
  },
  data: () => ({
    drawer: true,
    admin: [
      { title: "Home", icon: "mdi-home", to: "/" },
      { title: "Accounts", icon: "mdi-account-cog", to: "/accounts" },
      {
        title: "Monitoring Dashboard",
        icon: "mdi-monitor-dashboard",
        to: "/monitoring",
      },
      {
        title: "Reports",
        icon: "mdi-chart-gantt",
        to: "/reports",
      },
    ],
    guard: [
      { title: "Accounts", icon: "mdi-account-cog", to: "/accounts" },
      {
        title: "Monitoring Dashboard",
        icon: "mdi-monitor-dashboard",
        to: "/monitoring",
      },
    ],
  }),
  created() {
    this.$store.commit("STORE_DATA", this.temp);
  },
  methods: {
    logout() {
      this.$store.commit("STORE_USERINFO", null);
      this.$router.push("/login");
    },
  },
};
</script>
<style scoped></style>
