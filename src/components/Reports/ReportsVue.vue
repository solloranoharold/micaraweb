<template>
  <v-container fluid>
    <v-toolbar flat dense>
      <v-toolbar-title>Generate Report</v-toolbar-title>
    </v-toolbar>
    <v-data-table dense :items="Reports" :headers="Headers" v-if="!loading">
      <template v-slot:top>
        <v-toolbar flat dense>
          <v-flex md3>
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date1"
                  rounded
                  dense
                  outlined
                  label="Filter Date 1"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date1" @input="date1, (menu1 = false)">
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex md3>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date2"
                  rounded
                  dense
                  outlined
                  label="Filter Date 2"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date2" @input="date2, (menu2 = false)">
              </v-date-picker>
            </v-menu>
          </v-flex>
          <div class="pb-7">
            <v-btn small color="teal accent-4" dark @click="generateReport()"
              ><v-icon>mdi-magnify</v-icon>search</v-btn
            >
          </div>
        </v-toolbar>
        <v-toolbar flat dense v-if="Reports.length > 0">
          <v-spacer />
          <vue-json-to-csv
            :json-data="Reports"
            :labels="labels"
            :csv-title="csvtitle"
          >
            <v-btn
              dark
              x-small
              rounded
              class="teal darken-2"
              @click="
               generatePDF()
              "
              ><v-icon>mdi-file-pdf-box</v-icon>generate pdf</v-btn
            >
            <v-btn
              dark
              x-small
              rounded
              class="teal darken-2"
              @click="createCSVTitle()"
              ><v-icon>mdi-file</v-icon>generate report</v-btn
            >
          </vue-json-to-csv>
        </v-toolbar>
      </template>
    </v-data-table>
    <loading-view v-else />
  </v-container>
</template>

<script>
import VueJsonToCsv from "vue-json-to-csv";
import LoadingView from "../../views/LoadingView.vue";
export default {
  components: { VueJsonToCsv, LoadingView },
  data: () => ({
    loading: false,
    date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu1: false,
    date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu2: false,
    Reports: [],
    Headers: [
      { text: "Home Owner", value: "HomeOwner" },
      { text: "Visitor Name", value: "visitor_name" },
      { text: "Vehicle", value: "vehicle" },
      { text: "Plate", value: "plate_no" },
      { text: "Purpose of Visit", value: "purpose" },
      { text: "Date Arrival", value: "date_arrival", align: "center" },
      { text: "Date Departure", value: "date_departure", align: "center" },
      { text: "Checked By", value: "checker", align: "center" },
      { text: "Date Created", value: "DateCreated" },
    ],
    labels: {
      HomeOwner: { title: "Home Owner" },
      visitor_name: { title: "Visitor Name" },
      vehicle: { title: "Vehicle" },
      plate_no: { title: "Plate No" },
      purpose: { title: "Purpose of Visit" },
      date_arrival: { title: "Date Arrival" },
      date_departure: { title: "Date Departure" },
      checker: { title: "Checked By" },
      DateCreated: { title: "Date Created" },
    },
    csvtitle: null,
  }),
  methods: {
    createCSVTitle() {
      this.csvtitle = `GeneratedReport_${this.moment().format(
        "YYYYMMDDHHmms"
      )}`;
    },
    generatePDF() {
       this.loading = true;
      this.axios
        .post(
          `${this.api}pdf/print`,
          { reports: this.Reports, prepared_by: this.userInfo.user_id, date_range: { date1: this.date1, date2: this.date2 } },
          {
            responseType:'arraybuffer'
          }
      )
        .then((res) => { 
          if (res.data) {
            this.loading = false 
            console.log(res.data)
            const blob = new Blob([res.data], { type: 'application/pdf' });  // Change MIME type as needed

            // Create a download link for the Blob
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'generated-pdf.pdf';  // Specify the filename for download
            document.body.appendChild(link); // Append the link to the DOM (required for click to work)
            link.click(); // Simulate a click to trigger the download
            // document.body.removeChild(link); // Clean up the DOM by removing the link

            console.log('File downloaded successfully!');
          }
        })
    },
    generateReport() {
      if (this.date1 > this.date2) {
        alert("Date 1 is greater than Date 2");
        return false;
      }
      this.loading = true;
      this.axios
        .get(`${this.api}monitoring/generateReport/${this.date1}/${this.date2}`)
        .then((res) => {
          if (res.data) {
            this.Reports = this._.orderBy(
              res.data,
              ["DateCreated"],
              ["desc"]
            ).filter((rec) => {
              rec.date_arrival = rec.date_arrival ? this.moment(rec.date_arrival).format(
                "YYYY-MM-DD HH:mm:ss A"
              ) : '00:00:00';
              rec.checker = rec.checker ? rec.checker : "";
              rec.date_departure = rec.date_departure ?  rec.date_departure
                ? this.moment(rec.date_departure).format(
                    "YYYY-MM-DD HH:mm:ss A"
                  )
                : "" : '00:00:00';
              rec.DateCreated = this.moment(rec.DateCreated).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              return rec;
            });
          }
          this.loading = false;
          console.log(this.Reports ,'Reports')
        });
    },
  },
};
</script>

<style></style>
