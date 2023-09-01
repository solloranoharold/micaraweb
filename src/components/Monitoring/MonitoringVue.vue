<template>
  <v-container fluid class="--text text--accent-2">
    <v-toolbar flat dense>
      <v-toolbar-title
        ><v-icon large>mdi-monitor-dashboard</v-icon>Monitoring
        Dashboard</v-toolbar-title
      >
      <v-spacer />
      <v-btn
        dark
        rounded
        color="teal accent-4"
        small
        @click="$router.push('/reports')"
        ><v-icon>mdi-poll</v-icon>Generate Report</v-btn
      >
    </v-toolbar>

    <v-flex md2 xs4 lg2 sm4 class="pt-10">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            rounded
            dense
            outlined
            label="Filter Date"
            prepend-inner-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
          <v-btn text color="primary" @click="dateFilter()"> OK </v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>

    <v-divider />

    <v-data-table
      v-if="!loading"
      dense
      :search="search"
      :headers="datas.headers"
      :items="datas.items"
      item-key="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat dense>
          <v-flex md4 xs6 lg3 sm4 class="pt-10">
            <v-text-field
              placeholder="Search Visitor's Name "
              dense
              v-model="search"
              rounded
              outlined
              clearable
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-flex>

          <v-spacer />
          <v-btn rounded dark small class="teal darken-2"
            ><v-icon>mdi-plus</v-icon>Create Request</v-btn
          >
        </v-toolbar>
      </template>
    </v-data-table>
    <loading-view-vue v-else />
  </v-container>
</template>

<script>
import LoadingViewVue from "@/views/LoadingView.vue";
export default {
  components: { LoadingViewVue },
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    search: null,
    loading: false,
  }),
  created() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  methods: {
    dateFilter() {
      alert(this.date);
    },
  },
};
</script>

<style></style>
