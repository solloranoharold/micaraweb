<template>
  <v-container fluid>
    <v-toolbar flat dense>
      <v-toolbar-title>List of Visitor's</v-toolbar-title>
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
          <v-btn text color="primary" @click="loadMonitoring(), (menu = false)">
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>
    <v-data-table
      dense
      :search="search"
      :headers="Headers"
      :items="Transactions"
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
          <v-btn @click="openDialog()" rounded dark small class="teal darken-2"
            ><v-icon>mdi-plus</v-icon>Create Request</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:[`item.date`]>
        {{ date }}
      </template>
      <template v-slot:[`item.date_arrival`]="{ item }">
        <v-chip class="ma-2" small shaped outlined color="teal darken-2">
          <v-icon small>mdi-calendar</v-icon>
          {{ item.date_arrival }}
        </v-chip>
      </template>
      <template v-slot:[`item.date_departure`]="{ item }">
        <v-chip
          v-if="item.date_departure && item.date_departure != 'Invalid Date'"
          class="ma-2"
          small
          shaped
          outlined
          color="red darken-2"
        >
          <v-icon small>mdi-calendar</v-icon>
          {{ item.date_departure }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    Transactions: [],
    search: null,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    Headers: [
      { text: "Visitor Name", value: "visitor_name" },
      { text: "Vehicle", value: "vehicle" },
      { text: "Plate", value: "plate_no" },
      { text: "Purpose of Visit", value: "purpose" },
      { text: "Date Arrival", value: "date_arrival", align: "center" },
      { text: "Date Departure", value: "date_departure", align: "center" },
      { text: "Date Added", value: "date" },
    ],
  }),
  created() {
    this.loadMonitoring();
  },
  methods: {
    openDialog(item) {
      console.log(item);
      this.$store.commit("STORE_MONITORING", item ? item : null);
      setTimeout(() => {
        this.$router.push("/transaction");
      }, 500);
    },
    loadMonitoring() {
      this.loading = true;
      this.axios
        .post(`${this.api}monitoring/loadTransaction`, {
          userInfo: this.userInfo,
          date: this.date,
        })
        .then((res) => {
          if (res.data)
            this.Transactions = res.data.filter((rec) => {
              rec.date_arrival = this.moment(rec.date_arrival).format(
                "YYYY-MM-DD HH:mm:ss A"
              );
              rec.date_departure = rec.date_departure
                ? this.moment(rec.date_departure).format(
                    "YYYY-MM-DD HH:mm:ss A"
                  )
                : null;
              return rec;
            });
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
