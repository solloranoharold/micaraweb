<template>
  <v-container fluid v-if="!loading">
    <v-toolbar flat dense dark color="teal accent-4">
      <v-toolbar-title
        ><v-icon x-large>mdi-list-box-outline</v-icon>Visitor's
        Form</v-toolbar-title
      >
    </v-toolbar>
    <br />
    <v-flex md6 lg6 sm12 xs12>
      <v-text-field
        dense
        color="teal accent-4"
        rounded
        outlined
        readonly
        label="Date Today"
        prepend-inner-icon="mdi-calendar"
        v-model="dateToday"
      ></v-text-field>
    </v-flex>
    <v-row>
      <v-col cols="12" md="6" lg="6" sm="12" xs="12">
        <v-card ref="form" elevation="6">
          <h2 class="text-center">Home Owner's Information</h2>
          <v-divider style="border: 1px solid" />
          <v-card-text>
            <v-autocomplete
              color="teal accent-4"
              label=" Name "
              dense
              rounded
              v-model="addObj"
              outlined
              :items="HomeOwners"
              item-text="fullname"
              return-object
              required
            />
            <v-textarea
              color="teal accent-4"
              label="Address"
              dense
              v-model="addObj.address"
              rounded
              outlined
              readonly
            ></v-textarea>
            <v-text-field
              color="teal accent-4"
              label="Contact Number"
              dense
              v-model="addObj.contactno"
              rounded
              outlined
              readonly
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" sm="12" xs="12">
        <v-card ref="form" elevation="6">
          <h2 class="text-center">Visitor's Information</h2>
          <v-divider style="border: 1px solid" />
          <v-card-text>
            <v-text-field
              color="teal accent-4"
              label="Name"
              dense
              v-model="addObj.visitor_name"
              rounded
              outlined
              required
            ></v-text-field>
            <label
              >NOTE: Put N/A both vehicle and plate no if you dont have vehicle
            </label>
            <v-text-field
              color="teal accent-4"
              label="Vehicle"
              dense
              v-model="addObj.vehicle"
              rounded
              outlined
              required
            ></v-text-field>
            <v-text-field
              color="teal accent-4"
              label="Plate Number"
              dense
              v-model="addObj.plate_no"
              rounded
              outlined
              required
            ></v-text-field>
            <v-textarea
              color="teal accent-4"
              label="Purpose of Visit"
              dense
              v-model="addObj.purpose"
              rounded
              outlined
              required
            ></v-textarea>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <br />
    <v-btn
      v-if="(userInfo && editedIndex == -1) || !userInfo"
      @click="submitData()"
      dark
      block
      rounded
      color="teal darken-4"
      >SUBMIT</v-btn
    >
    <v-btn
      v-else
      @click="proceedMonitoring()"
      dark
      small
      rounded
      color="teal darken-4"
    >
      <v-icon>mdi-arrow-left</v-icon> Proceed to Monitoring
    </v-btn>
  </v-container>
  <loading-view v-else />
</template>

<script>
import LoadingView from "../../views/LoadingView.vue";
export default {
  components: { LoadingView },
  data: () => ({
    HomeOwners: [],
    loading: false,
    dateToday: null,
    addObj: {},
    editedIndex: -1,
    Monitoring: [],
  }),
  created() {
    this.loadMonitoring();
    this.loadHomeOwners();
    this.dateToday = this.moment().format("YYYY-MM-DD");
    if (this.monitoring_data !== null) {
      console.log(this.monitoring_data, "qweqweq");
      this.addObj = JSON.parse(JSON.stringify(this.monitoring_data));
      this.editedIndex = 1;
    }
  },
  methods: {
    proceedMonitoring() {
      this.$store.commit("STORE_MONITORING", null);
      this.$router.push("/monitoring");
    },
    loadMonitoring() {
      this.loading = true;
      this.axios
        .post(`${this.api}monitoring/loadTransaction`, {
          userInfo: "",
        })
        .then((res) => {
          if (res.data) this.Monitoring = res.data;
          this.loading = false;
        });
    },
    loadHomeOwners() {
      this.loading = true;
      this.axios.get(`${this.api}accounts/loadAccounts`).then((res) => {
        if (res.data) {
          this.HomeOwners = res.data.filter((rec) => {
            this.addObj.vehicle = "N/A";
            this.addObj.plate_no = "N/A";
            if (
              this.monitoring_data &&
              rec.user_id == this.monitoring_data.user_id
            ) {
              this.addObj = { ...rec };
              this.addObj = { ...this.monitoring_data };
            }

            return rec.position == "Home Owner";
          });
          this.$store.commit("STORE_MONITORING", null);
          this.loading = false;
        }
      });
    },
    submitData() {
      if (
        !this.addObj.user_id ||
        !this.addObj.visitor_name ||
        !this.addObj.vehicle ||
        !this.addObj.plate_no ||
        !this.addObj.purpose
      ) {
        this.Swal.fire({
          position: "top-end",
          toast: true,
          icon: "info",
          title: "Please Complete Fields!",
          showConfirmButton: false,
          timer: 1500,
        });
        return false;
      }
      if (this.editedIndex == -1) {
        this.addObj.date_arrival = this.moment().format("YYYY-MM-DD HH:mm:ss");
        let i = this.Monitoring.findIndex(
          (x) =>
            x.user_id == this.addObj.user_id &&
            this.addObj.visitor_name.toUpperCase() ==
              x.visitor_name.toUpperCase() &&
            this.moment(x.date_arrival).format("YYYY-MM-DD") ==
              this.dateToday &&
            !x.date_departure
        );
        if (i > -1) {
          this.Swal.fire({
            position: "bottom-end",
            toast: true,
            icon: "info",
            title: "This visitor is already inside!",
            showConfirmButton: false,
            timer: 1500,
          });
          this.addObj = {};
          return false;
        }
      }

      this.addObj.index = this.editedIndex;
      this.Swal.fire({
        title: `Are you sure you want to ${
          this.editedIndex == -1 ? "create" : "update"
        } ?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00796B",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${
          this.editedIndex == -1 ? "create" : "update"
        } it!`,
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(this.addObj);
          this.axios
            .post(`${this.api}monitoring/insertUpdateRequest`, this.addObj)
            .then((res) => {
              if (res.data) {
                if (this.editedIndex == -1) {
                  this.addObj = {};
                  this.Swal.fire({
                    position: "center",
                    icon: "success",
                    title:
                      "FORM HAS BEEN COMPLETE PLEASE WAIT WHILE SECURITY IS CHECKING YOUR INFORMATION",
                    showConfirmButton: true,
                  });
                } else {
                  this.$router.push("/monitoring");
                  this.Swal.fire({
                    position: "bottom-end",
                    toast: true,
                    icon: "success",
                    title: "Data hasa been updated!",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                }
              }
            });
        }
      });
    },
  },
};
</script>

<style></style>
