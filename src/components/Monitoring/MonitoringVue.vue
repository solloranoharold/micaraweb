<template>
  <v-container fluid class="--text text--accent-2">
    <v-toolbar flat dense>
      <v-toolbar-title
        ><v-icon large>mdi-monitor-dashboard</v-icon>Monitoring
        Dashboard</v-toolbar-title
      >
      <v-spacer />
      Total Visitors as of {{ date }} is
      <strong class="pl-1">
        <span>{{ Transactions.length }}</span></strong
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
      :headers="Headers"
      :items="Transactions"
      item-key="name"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat dense>
          <v-flex md4 xs6 lg3 sm4 class="pt-10">
            <v-text-field
              placeholder="Search...."
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
        <v-btn
          x-small
          rounded
          outlined
          @click="addArrival(item)"
          dark
          class="teal darken-2"
          v-if="item.date_arrival == 'Invalid date' || !item.date_arrival"
          ><v-icon small>mdi-calendar</v-icon>add date</v-btn
        >
        <span v-else>
          <v-chip class="ma-2" small shaped outlined color="green darken-2">
            <v-icon small>mdi-calendar</v-icon>
            {{ item.date_arrival }}
          </v-chip>
        </span>
      </template>
      <template v-slot:[`item.date_departure`]="{ item }">
        <v-btn
          x-small
          rounded
          outlined
          @click="addDeparture(item)"
          dark
          class="red darken-2"
          v-if="item.date_departure == 'Invalid date' || !item.date_departure"
          ><v-icon small>mdi-calendar</v-icon>add date</v-btn
        >
        <span v-else>
          <v-chip class="ma-2" small shaped outlined color="red darken-2">
            <v-icon small>mdi-calendar</v-icon>
            {{ item.date_departure }}
          </v-chip>
        </span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon dark color="success" @click="openDialog(item)">{{
          userInfo.position == "Administrator" ? "mdi-pencil" : "mdi-eye"
        }}</v-icon>
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
    dialog: false,
    editedIndex: -1,
    addObj: {},
    Transactions: [],
    Headers: [
      { text: "Home Owner", value: "HomeOwner" },
      { text: "Visitor Name", value: "visitor_name" },
      { text: "Vehicle", value: "vehicle" },
      { text: "Plate", value: "plate_no" },
      { text: "Purpose of Visit", value: "purpose" },
      { text: "Date Arrival", value: "date_arrival", align: "center" },
      { text: "Date Departure", value: "date_departure", align: "center" },
      { text: "Checked By", value: "checker", align: "center" },
      { text: "Date Added", value: "DateCreated" },
      { text: "Actions", value: "actions" },
    ],
  }),
  created() {
    this.loadMonitoring();
  },
  methods: {
    loadMonitoring() {
      this.loading = true;
      this.axios
        .post(`${this.api}monitoring/loadTransaction`, {
          userInfo: this.userInfo,
          date: this.date,
        })
        .then((res) => {
          if (res.data)
            this.Transactions = this._.orderBy(
              res.data,
              ["DateCreated"],
              ["desc"]
            ).filter((rec) => {
              rec.date_arrival = rec.date_arrival
                ? this.moment(rec.date_arrival).format("YYYY-MM-DD HH:mm:ss A")
                : null;
              rec.date_departure = rec.date_departure
                ? this.moment(rec.date_departure).format(
                    "YYYY-MM-DD HH:mm:ss A"
                  )
                : null;
              rec.DateCreated = this.moment(rec.DateCreated).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              return rec;
            });
          this.loading = false;
        });
    },
    addArrival(item) {
      item.index = 1;
      delete item.date_departure;
      this.Swal.fire({
        title: `Are you sure you want to add arrival date ?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00796B",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, add arrival date!`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          item.checkedBy = this.userInfo.user_id;
          item.date_arrival = this.moment().format("YYYY-MM-DD HH:mm:ss");
          this.axios
            .post(`${this.api}monitoring/insertUpdateRequest`, item)
            .then((res) => {
              if (res.data) {
                this.Swal.fire({
                  position: "bottom-end",
                  toast: true,
                  icon: "success",
                  title: "Data hasa been updated!",
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.loadMonitoring();
              }
            });
        }
      });
    },
    addDeparture(item) {
      item.index = 1;
      item.date_arrival = this.moment(item.date_arrival).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.Swal.fire({
        title: `Are you sure you want to add departure date ?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00796B",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, add departure date!`,
      }).then((result) => {
        if (result.isConfirmed) {
          item.checkedBy = this.userInfo.user_id;
          item.date_departure = this.moment().format("YYYY-MM-DD HH:mm:ss");
          this.loading = true;
          this.axios
            .post(`${this.api}monitoring/insertUpdateRequest`, item)
            .then((res) => {
              if (res.data) {
                this.Swal.fire({
                  position: "bottom-end",
                  toast: true,
                  icon: "success",
                  title: "Data hasa been updated!",
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.loadMonitoring();
              }
            });
        }
      });
    },
    dateFilter() {
      this.loadMonitoring();
      this.menu = false;
    },
    openDialog(item) {
      console.log(item);
      this.$store.commit("STORE_MONITORING", item ? item : null);
      setTimeout(() => {
        this.$router.push("/transaction");
      }, 500);
    },
  },
};
</script>

<style></style>
