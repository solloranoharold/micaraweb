<template>
  <v-app>
    <v-app-bar v-if="isHide == false" app dark class="teal accent-4">
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
    <v-navigation-drawer v-model="drawer" app fixed width="250">
      <div class="d-flex align-center">
        <v-img
          aspect-ratio="1"
          alt="Profile"
          src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
        ></v-img>
      </div>
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6"> John Leider </v-list-item-title>
            <v-list-item-subtitle>john@vuetifyjs.com</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group active-class="teal accent-2 --text text--accent-2">
          <v-list-item v-for="(item, i) in navbar" :key="i" :to="item.to">
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
            <v-list-item>
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
  watch: {
    isHide(val) {
      this.drawer = !val;
    },
  },
  data: () => ({
    drawer: true,

    navbar: [
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
  }),
  created() {
    this.$store.commit("STORE_DATA", this.temp);
  },
};
</script>
<style scoped></style>
