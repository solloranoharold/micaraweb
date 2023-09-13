<template>
  <v-container fluid v-if="!loading">
    <v-toolbar flat dense>
      <v-toolbar-title
        ><v-icon>mdi-view-dashboard</v-icon> Dashboard</v-toolbar-title
      >
      <v-spacer />
    </v-toolbar>
    <v-row>
      <v-col>
        <v-card
          dark
          :color="`#${Math.floor(Math.random() * 16777215).toString(16)}`"
        >
          <v-card-text>
            <h3>NO. OF HOME OWNERS</h3>
            <v-col cols="3">
              <v-layout>
                <v-icon x-large>mdi-account</v-icon>
                <v-spacer />
                <span style="font-size: 35px">
                  <strong>{{ Accounts.length }}</strong></span
                >
              </v-layout>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          dark
          :color="`#${Math.floor(Math.random() * 16777215).toString(16)}`"
        >
          <v-card-text>
            <h3>YEARLY VISITORS ( {{ year }} )</h3>
            <v-col cols="3">
              <v-layout>
                <v-icon x-large>mdi-account</v-icon>
                <v-spacer />
                <span style="font-size: 35px">
                  <strong>{{ Records.length }}</strong></span
                >
              </v-layout>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card
          dark
          :color="`#${Math.floor(Math.random() * 16777215).toString(16)}`"
        >
          <v-card-text>
            <h3>VISITORS FOR {{ getMonthStr }} {{ year }}</h3>
            <v-col cols="3">
              <v-layout>
                <v-icon x-large>mdi-account</v-icon>
                <v-spacer />
                <span style="font-size: 35px">
                  <strong>{{ getMonths.length }}</strong></span
                >
              </v-layout>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          dark
          :color="`#${Math.floor(Math.random() * 16777215).toString(16)}`"
        >
          <v-card-text>
            <h3>VISITORS FOR {{ getDayStr }},{{ year }}</h3>
            <v-col cols="3">
              <v-layout>
                <v-icon x-large>mdi-account</v-icon>
                <v-spacer />
                <span style="font-size: 35px">
                  <strong>{{ getDay.length }}</strong></span
                >
              </v-layout>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <br />
    <v-toolbar flat dense>
      <v-spacer />
      <v-flex md2 lg2 sm6 xs6 pt-5>
        <v-autocomplete
          dense
          rounded
          label="Select Year"
          outlined
          v-model="year"
          :items="Years"
          item-text="year"
          @change="loadData()"
        ></v-autocomplete>
      </v-flex>
      <v-flex md2 lg2 sm6 xs6 pt-5>
        <v-autocomplete
          dense
          rounded
          label="Select Chart"
          outlined
          v-model="chart"
          :items="charts"
        ></v-autocomplete>
      </v-flex>
    </v-toolbar>

    <LineChart
      v-if="chart == 'Line'"
      :chartdata="chartData"
      :options="options"
    />
    <BarChart v-else :chartdata="chartData" :options="options" />
  </v-container>
  <loading-view v-else />
</template>

<script>
import LineChart from "./Charts/LineChart.vue";
import BarChart from "./Charts/BarChart.vue";
import LoadingView from "./LoadingView.vue";
export default {
  name: "HomeView",

  components: { BarChart, LineChart, LoadingView },
  data: () => ({
    loading: false,
    year: null,
    Years: [],
    getMonthStr: null,
    getDayStr: null,
    Months: [
      { x: 0, month: "01", str: "JANUARY" },
      { x: 0, month: "02", str: "FEBRUARY" },
      { x: 0, month: "03", str: "MARCH" },
      { x: 0, month: "04", str: "APRIL" },
      { x: 0, month: "05", str: "MAY" },
      { x: 0, month: "06", str: "JUNE" },
      { x: 0, month: "07", str: "JULY" },
      { x: 0, month: "08", str: "AUGUST" },
      { x: 0, month: "09", str: "SEPTEMBER" },
      { x: 0, month: "10", str: "OCTOBER" },
      { x: 0, month: "11", str: "NOVEMBER" },
      { x: 0, month: "12", str: "DECEMBER" },
    ],
    charts: ["Bar", "Line"],
    chart: "Bar",
    chartData: {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    options: {
      animation: {
        easing: "easeOutQuart",
        duration: 1000,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              enabled: true,
              fontFamily: "Arial",
              fontStyle: "bold",
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              enabled: true,
              fontFamily: "Arial",
              fontStyle: "bold",
            },
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
    },
    Records: [],
    Accounts: [],
  }),
  created() {
    this.loadAccounts();
    this.loadYears();
    this.getMonthStr = this.moment().format("MMMM");
    this.getDayStr = this.moment().format("MMMM DD");
  },
  computed: {
    getMonths() {
      return this.Records.filter((rec) => {
        return (
          this.moment(rec.DateCreated).format("YYYY-MM") ==
          this.moment().format("YYYY-MM")
        );
      });
    },
    getDay() {
      return this.Records.filter((rec) => {
        return (
          this.moment(rec.DateCreated).format("YYYY-MM-DD") ==
          this.moment().format("YYYY-MM-DD")
        );
      });
    },
  },
  methods: {
    loadAccounts() {
      this.loading = true;
      this.axios.get(`${this.api}accounts/loadAccounts`).then((res) => {
        if (res.data) {
          console.log(res.data);
          this.Accounts = res.data.filter((rec) => {
            rec.date_created = this.moment(rec.date_created).format(
              "YYYY-MM-DD HH:mm:ss A"
            );
            return rec.position == "Home Owner";
          });
          this.loading = false;
        }
      });
    },
    loadYears() {
      this.axios.get(`${this.api}monitoring/loadYears`).then((res) => {
        if (res.data) {
          this.Years = this._.orderBy(res.data, ["year"], ["desc"]);
          if (this.Years.length > 0) this.year = this.Years[0].year;
          this.loadData();
        }
      });
    },
    loadData() {
      this.loading = true;
      this.axios
        .get(
          `${this.api}monitoring/generateReport/${this.year}-01-31/${this.year}-12-31`
        )
        .then((res) => {
          if (res.data) {
            let data = this.Months.map((item) => {
              res.data.filter((rec) => {
                if (rec.DateCreated.includes(`${this.year}-${item.month}`))
                  item.x += 1;
              });
              return item.x.toFixed(2).toString();
            });
            this.chartData.datasets = [
              {
                label: `Total Visitors as of ${this.year}`,
                backgroundColor: `#${Math.floor(
                  Math.random() * 16777215
                ).toString(16)}`,
                data: data,
              },
            ];
            // console.log(this.chartData)
            this.Records = res.data;
            this.loading = false;
          }
        });
    },
  },
};
</script>
