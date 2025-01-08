<template>
  <v-container fluid class="--text text--accent-2">
    <v-toolbar flat dense>
      <v-toolbar-title><v-icon large>mdi-account-cog</v-icon>Accounts
        Dashboard</v-toolbar-title>
    </v-toolbar>

    <v-flex md2 xs4 lg2 sm4 class="pt-10">
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
        min-width="auto">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field v-model="date" rounded dense outlined label="Filter Date" prepend-inner-icon="mdi-calendar"
            readonly v-bind="attrs" v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="date">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
          <v-btn text color="primary" @click="dateFilter()"> OK </v-btn>
        </v-date-picker>
      </v-menu>
    </v-flex>

    <v-divider />
    <v-data-table v-if="!loading" dense :search="search" :headers="AccountHeaders" :items="Accounts" item-key="name"
      class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat dense>
          <v-flex md4 xs6 lg3 sm4 class="pt-10">
            <v-text-field placeholder="Search..." dense v-model="search" rounded outlined clearable
              prepend-inner-icon="mdi-magnify"></v-text-field>
          </v-flex>

          <v-spacer />
          <v-btn @click="openDialog()" rounded dark small class="teal darken-2"><v-icon>mdi-account-plus</v-icon>Add
            Account</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="openDialog(item)">mdi-pencil</v-icon>
      </template>
    </v-data-table>
    <loading-view-vue v-else />

    <v-dialog v-model="dialog" persistent scrollable max-width="700">
      <v-card>
        <v-toolbar dark flat dense color="teal darken-2">
          <v-toolbar-title>{{
            editedIndex == -1 ? "Create " : "Update"
            }}
            Account</v-toolbar-title>
          <v-spacer />
          <v-icon @click="closeDialog()">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1" color="teal darken-2">
                Personal Information
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2" color="teal darken-2">
                Account Information
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="mb-12">
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <input type="file" dense outlined rounded accept="image/*" label="Upload Image"
                          @change="onFileChange($event)" />
                        <v-img aspect-ration="2" :src="img ? img : `${ftp}users/${addObj.profile_img}`" />
                      </v-col>
                      <!-- user_id -->
                      <v-col cols="12">
                        <v-text-field v-if="!user_id" dense v-model="addObj.user_id" readonly rounded outlined
                          label="ID"></v-text-field>
                        <v-text-field v-else dense v-model="user_id" readonly rounded outlined
                          label="ID"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field dense v-model="addObj.firstname" rounded outlined
                          label="Firstname"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field dense v-model="addObj.lastname" rounded outlined label="Lastname"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete v-model="addObj.position_id" :items="Positions" item-text="position"
                          item-value="position_id" dense rounded outlined label="Position" append-icon="mdi-note"
                          @click:append="
                            userInfo.position == 'Administrator'
                              ? evaluatePosition()
                              : ''
                          "></v-autocomplete>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field v-model="addObj.phase" dense rounded outlined label="Phase"></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field v-model="addObj.block" dense rounded outlined label="Block"></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field v-model="addObj.lot" dense rounded outlined label="Lot"></v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <v-text-field v-model="addObj.street" dense rounded outlined label="Street"></v-text-field>
                      </v-col>

                      <v-col>
                        <v-autocomplete v-model="addObj.gender" :items="['M', 'F']" dense rounded outlined
                          label="Gender"></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="addObj.contactno" dense rounded outlined
                          label="Contact No"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <v-btn small dark color="teal darken-2" @click="proceedStepper(2)">
                  Continue
                </v-btn>

                <v-btn dark color="red darken-2" text @click="closeDialog()">
                  Cancel
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-text-field dense :disabled="editedIndex > -1" v-model="addObj.username" rounded outlined
                  label="Username"></v-text-field>
                <v-text-field dense :disabled="editedIndex > -1" v-model="addObj.password" rounded type="password"
                  outlined label="Password"></v-text-field>
                <v-text-field v-if="editedIndex == -1" dense v-model="addObj.cpass" rounded type="password" outlined
                  label="Confirm Passwor"></v-text-field>
                <v-btn small dark color="teal darken-2" @click="proceedStepper(3)">
                  Continue
                </v-btn>

                <v-btn dark color="red darken-2" text @click="e1 -= 1">
                  Cancel
                </v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="position_dialog" max-width="500px" persistent scrollable>
      <v-card>
        <v-toolbar flat dense dark class="teal darken-4">
          <v-toolbar-title>Positions</v-toolbar-title>
          <v-spacer />
          <v-icon @click="position_dialog = !position_dialog">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-text-field dense v-model="posObj.position" rounded outlined label="Position"></v-text-field>
            <v-btn block small rounded dark color="teal darken-2" @click="insertUpdatePosition()">
              Save
            </v-btn>
            <br />
            <v-data-table dense :headers="PositionHeaders" :items="Positions">
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon @click="evaluatePosition(item)">mdi-pencil</v-icon>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import LoadingViewVue from "@/views/LoadingView.vue";

export default {
  components: { LoadingViewVue },
  data: () => ({
    user_id:'',
    position_dialog: false,
    file: null,
    e1: 1,
    editedIndex: -1,
    dialog: false,
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu: false,
    search: null,
    loading: false,
    addObj: {},
    posObj: {},
    posIndex: -1,
    Accounts: [],
    AccountHeaders: [
      { text: "ID", value: "user_id" },
      { text: "Fullname", value: "fullname" },
      { text: "Gender", value: "gender" },
      { text: "Phase", value: "phase" },
      { text: "Block", value: "block" },
      { text: "Lot", value: "lot" },
      { text: "Street", value: "street" },
      { text: "Position", value: "position" },
      { text: "Date Created", value: "date_created" },
      { text: "Actions", value: "actions" },
    ],
    Positions: [],
    PositionHeaders: [
      { text: "ID", value: "position_id" },
      { text: "Position", value: "position" },
      { text: "Date Created", value: "date_created" },
      { text: "Action", value: "actions" },
    ],
    img: null,
  }),
  created() {
    this.loadPositions();
    this.loadAccounts();
  },
  methods: {
    loadAccounts() {
      this.loading = true;
      this.axios.get(`${this.api}accounts/loadAccounts`).then((res) => {
        if (res.data) {
          this.Accounts = res.data.filter((rec) => {
            rec.date_created = this.moment(rec.date_created).format(
              "YYYY-MM-DD HH:mm:ss A"
            );
            rec.fullname = `${rec.firstname} ${rec.lastname}`
           if (rec.username != this.userInfo.username) {
              return rec;
            }
          });
          this.loading = false;
        }
      });
    },
    loadPositions() {
      this.axios.get(`${this.api}accounts/positions`).then((res) => {
        if (res.data)
          this.Positions = res.data.filter((rec) => {
            if (this.userInfo.position == "Administrator") return rec;
            if (this.userInfo.position == "Security Guard")
              return rec.position == "Home Owner";
          });
      });
    },
    evaluatePosition(item) {
      this.posObj = { ...item };
      this.posIndex = this.Positions.indexOf(item);
      this.posObj.index = this.posIndex;
      this.position_dialog = true;
    },
    insertUpdatePosition() {
      if (!this.posObj.position) {
        this.Swal.fire({
          position: "bottom-end",
          toast: true,
          icon: "error",
          title: "Insert Position",
          showConfirmButton: false,
          timer: 1500,
        });
        return false;
      }
      if (this.posIndex == -1) {
        let i = this.Positions.findIndex(
          (x) => x.position.toUpperCase() == this.posObj.position.toUpperCase()
        );
        if (i > -1) {
          this.Swal.fire({
            position: "bottom-end",
            toast: true,
            icon: "info",
            title: "Position Already Exists!",
            showConfirmButton: false,
            timer: 1500,
          });
          return false;
        }
      }
      this.axios
        .post(`${this.api}accounts/insertUpdatePosition`, this.posObj)
        .then((res) => {
          if (res.data) {
            this.loadPositions();
            this.Swal.fire({
              position: "bottom-end",
              toast: true,
              icon: "success",
              title: "Position has been saved!",
              showConfirmButton: false,
              timer: 1500,
            });

            this.posObj = {};
          }
        });
    },
    onFileChange(e) {
      this.file = e.target.files || e.dataTransfer.files;
      if (!this.file.length) return;
      this.createImage();
    },
    createImage() {
      var reader = new FileReader();
      reader.onload = (e) => {
        this.img = e.target.result;
      };
      reader.readAsDataURL(this.file ? this.file[0] : this.addObj.profile_img);
    },
    dateFilter() {
      alert(this.date);
    },
    openDialog(item) {
      if (
        this.userInfo.position == "Security Guard" &&
        item.position != "Home Owner"
      ) {
        alert("YOU ARE NOT ALLOWED TO OPEN THIS DETAILS");
        return false;
      }
      this.editedIndex = this.Accounts.indexOf(item);
      this.addObj = { ...item };
      if (this.editedIndex == -1) {
        this.axios.get(`${this.api}accounts/usersLength`).then((res) => { 
          if (res.data) this.user_id = res.data.user_id 
        })
      }
      this.addObj.index = this.editedIndex;

      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.addObj = {};
      this.e1 = 1;
      this.user_id=''
    },
    proceedStepper(i) {
      if (
        !this.addObj.firstname ||
        !this.addObj.lastname ||
        !this.addObj.position_id ||
        !this.addObj.gender ||
        !this.addObj.phase ||
        !this.addObj.block ||
        !this.addObj.lot ||
        !this.addObj.street ||
        !this.addObj.contactno
      ) {
        this.Swal.fire({
          position: "bottom-end",
          toast: true,
          icon: "error",
          title: "Complete all fields",
          showConfirmButton: false,
          timer: 1500,
        });
        return false;
      }

      if (i == 3) {
        if (!this.addObj.username || !this.addObj.password) {
          this.Swal.fire({
            position: "bottom-end",
            toast: true,
            icon: "error",
            title: "Complete all fields",
            showConfirmButton: false,
            timer: 1500,
          });
          return false;
        }
        if (this.editedIndex == -1) {
          let i = this.Accounts.findIndex(
            (x) =>
              x.username.toUpperCase() == this.addObj.username.toUpperCase()
          );
          if (i > -1) {
            this.Swal.fire({
              position: "bottom-end",
              toast: true,
              icon: "info",
              title: "Username already exists!",
              showConfirmButton: false,
              timer: 1500,
            });
            return false;
          }
          if (
            this.addObj.password.toUpperCase() !=
            this.addObj.cpass.toUpperCase()
          ) {
            this.Swal.fire({
              position: "bottom-end",
              toast: true,
              icon: "error",
              title: "Password and Confirm Password not matched!",
              showConfirmButton: false,
              timer: 1500,
            });
            return false;
          }
        }

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
            this.loading = true;
            let formData = new FormData();
            this.addObj.profile_img = this.file
              ? `${this.addObj.username}_${this.moment().format(
                  "YYYYMMDDHHmmss"
                )}.${this.file[0].name.split(".")[1]}`
              : this.addObj.profile_img
              ? this.addObj.profile_img
              : "";
            if (this.file) {
              formData.append("myData", JSON.stringify(this.addObj));
              formData.append("file", this.file[0]);
              this.axios
                .post(`${this.api}accounts/uploadImg`, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    dataType: "json",
                  },
                })
                .then((res) => {
                  console.log(res.data);
                });
            }
            this.axios
              .post(`${this.api}accounts/insertUpdateAccounts`, this.addObj)
              .then((res) => {
                if (res.data) {
                  this.Swal.fire({
                    position: "bottom-end",
                    toast: true,
                    icon: "success",
                    title: `Data has been ${
                      this.editedIndex == -1 ? "create" : "update"
                    }d`,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  this.loading = false;
                  this.closeDialog();
                  this.loadAccounts()
                }
              });
          }
        });
      } else {
        this.e1 = i;
      }
    },
  },
};
</script>

<style></style>
