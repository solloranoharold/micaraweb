<template>
  <v-container fluid class="orientation">
    <h2 class="text-center" style="text-decoration: underline">
      MICARA ESTATES-TANZA REPORT
    </h2>
    <v-simple-table v-if="!loading">
      <thead>
        <tr>
          <th>Home Owner</th>
          <th>Visitor Name</th>
          <th>Vehicle</th>
          <th>Plate</th>
          <th>Purpose of Visit</th>
          <th>Date Arrival</th>
          <th>Date Departure</th>
          <th>Checked By</th>
          <th>Date Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, i) in Reports" :key="i">
          <td>{{ data.HomeOwner }}</td>
          <td>{{ data.visitor_name }}</td>
          <td>{{ data.vehicle }}</td>
          <td>{{ data.plate_no }}</td>
          <td>{{ data.purpose }}</td>
          <td>{{ data.date_arrival }}</td>
          <td>{{ data.date_departure }}</td>
          <td>{{ data.checker }}</td>
          <td>{{ data.DateCreated }}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <loading-view v-else />
  </v-container>
</template>
<script>
import LoadingView from "../../views/LoadingView.vue";
export default {
  components: { LoadingView },
  data: () => ({
    Reports: [],
    datetoday: null,
    loading: false,
  }),
  created() {
    this.datetoday = this.moment().format("YYYY-MM-DD HH:mm:ss A");
    this.generateReport();
  },
  methods: {
    async printData() {
      await this.$store.commit("HIDE_APP", true);
      await this.print().then(async () => {
        await this.$store.commit("HIDE_APP", false);
        await this.$router.push("/reports");
      });
    },
    print() {
      return new Promise((resolve) => {
        resolve(window.print());
      });
    },
    async generateReport() {
      this.loading = true;
      await this.axios
        .get(
          `${this.api}monitoring/generateReport/${this.$route.params.date1}/${this.$route.params.date2}`
        )
        .then((res) => {
          if (res.data) {
            this.Reports = this._.orderBy(
              res.data,
              ["DateCreated"],
              ["desc"]
            ).filter((rec) => {
              rec.date_arrival = this.moment(rec.date_arrival).format(
                "YYYY-MM-DD HH:mm:ss A"
              );
              rec.checker = rec.checker ? rec.checker : "";
              rec.date_departure = rec.date_departure
                ? this.moment(rec.date_departure).format(
                    "YYYY-MM-DD HH:mm:ss A"
                  )
                : "";
              rec.DateCreated = this.moment(rec.DateCreated).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              return rec;
            });
          }
          this.loading = false;
        });

      await this.printData();
    },
  },
};
</script>
<style>
.orientation {
  width: auto;
}
@media print {
  .orientation {
    width: 100%;
  }
}
</style>
