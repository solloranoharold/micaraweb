<template>
  <v-container fluid id="bg">
    <center>
      <v-flex md7>
        <br /><br /><br /><br />

        <v-card style="border-radius: 50px" elevation="4">
          <h2 class="pa-2 text-center" style="text-decoration: underline">
            Visitor Monitoring System
          </h2>
          <v-divider />
          <v-row no-gutters v-if="!loading">
            <v-col md="6" xs="12" sm="12" lg="6">
              <v-img width="40%" src="micaraland-logo-final.png"> </v-img>
              <center>Scan this for visitors</center>
              <v-img width="35%" src="../assets/img/qrcode.png"> </v-img>
            </v-col>
            <v-col>
              <center>
                <v-card-text>
                  <br />
                  <h2 class="text-center" style="text-decoration: underline">
                    Login
                  </h2>
                  <v-divider />
                  <br />

                  <v-text-field
                    dense
                    prepend-inner-icon="mdi-account"
                    color="#33691E"
                    v-model="username"
                    rounded
                    outlined
                    label="Username"
                  ></v-text-field>
                  <v-text-field
                    dense
                    prepend-inner-icon="mdi-key"
                    color="#33691E"
                    v-model="password"
                    type="password"
                    rounded
                    outlined
                    @keypress.enter="loginAccount()"
                    label="Password"
                  ></v-text-field>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      dark
                      color="#33691E"
                      rounded
                      outlined
                      small
                      @click="openDialog()"
                    >
                      <v-icon>mdi-account-plus</v-icon>
                      Sign Up
                    </v-btn>
                    <v-btn
                      dark
                      color="#33691E"
                      rounded
                      outlined
                      small
                      @click="loginAccount()"
                      ><v-icon>mdi-login</v-icon>login</v-btn
                    >
                  </v-card-actions>
                </v-card-text>
              </center>
            </v-col>
          </v-row>
          <loading-view-vue v-else />
        </v-card>
      </v-flex>
    </center>
    <v-dialog v-model="dialog" persistent scrollable max-width="700">
      <v-card>
        <v-toolbar dark flat dense color="teal darken-2">
          <v-toolbar-title
            >{{
              editedIndex == -1 ? "Create " : "Update"
            }}
            Account</v-toolbar-title
          >
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
                        <input
                          type="file"
                          dense
                          outlined
                          rounded
                          accept="image/*"
                          label="Upload Image"
                          @change="onFileChange($event)"
                        />
                        <v-img aspect-ration="2" :src="img" />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          dense
                          v-model="addObj.fullname"
                          rounded
                          outlined
                          label="Fullname"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="addObj.position_id"
                          :items="Positions"
                          item-text="position"
                          item-value="position_id"
                          dense
                          rounded
                          outlined
                          label="Position"
                        ></v-autocomplete>
                      </v-col>
                      <v-col>
                        <v-text-field
                          dense
                          v-model="addObj.age"
                          rounded
                          type="number"
                          min="1"
                          outlined
                          label="Age"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-autocomplete
                          v-model="addObj.gender"
                          :items="['M', 'F']"
                          dense
                          rounded
                          outlined
                          label="Gender"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="addObj.address"
                          dense
                          rounded
                          outlined
                          label="Blk/Lot/Street/City"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="addObj.contactno"
                          dense
                          rounded
                          outlined
                          label="Contact No"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <v-btn
                  small
                  dark
                  color="teal darken-2"
                  @click="proceedStepper(2)"
                >
                  Continue
                </v-btn>

                <v-btn dark color="red darken-2" text @click="closeDialog()">
                  Cancel
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-text-field
                  dense
                  :disabled="editedIndex > -1"
                  v-model="addObj.username"
                  rounded
                  outlined
                  label="Username"
                ></v-text-field>
                <v-text-field
                  dense
                  :disabled="editedIndex > -1"
                  v-model="addObj.password"
                  rounded
                  type="password"
                  outlined
                  label="Password"
                ></v-text-field>
                <v-text-field
                  v-if="editedIndex == -1"
                  dense
                  v-model="addObj.cpass"
                  rounded
                  type="password"
                  outlined
                  label="Confirm Passwor"
                ></v-text-field>
                <v-btn
                  small
                  dark
                  color="teal darken-2"
                  @click="proceedStepper(3)"
                >
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
  </v-container>
</template>

<script>
import LoadingViewVue from "../views/LoadingView.vue";
export default {
  components: { LoadingViewVue },
  data: () => ({
    loading: false,
    username: "",
    password: "",
    addObj: {},
    editedIndex: -1,
    e1: 1,
    Accounts: [],
    img: null,
    file: null,
    Positions: [],
    dialog: false,
  }),
  created() {
    this.loadPositions();
    this.loadAccounts();
  },
  methods: {
    loginAccount() {
      this.loading = true;
      this.axios
        .post(`${this.api}accounts/loginAccount`, {
          username: this.username.toUpperCase(),
          password: this.password,
        })
        .then((res) => {
          if (res.data) {
            if (res.data.users.length > 0) {
              console.log(res.data);
              if (!res.data.password) {
                this.Swal.fire({
                  position: "bottom-end",
                  toast: true,
                  icon: "error",
                  title: "Username and Password not matched!",
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.loading = false;
                return false;
              }
              if (res.data.users[0].isBan == 0) {
                this.$store.commit("STORE_USERINFO", res.data.users[0]);
                setTimeout(() => {
                  if (res.data.users[0].position == "Administrator")
                    this.$router.push("/");
                  else if (res.data.users[0].position == "Security Guard")
                    this.$router.push("/monitoring");
                  else this.$router.push("/homeowner");
                  this.Swal.fire({
                    position: "bottom-end",
                    toast: true,
                    icon: "info",
                    title: `Welcome : ${res.data.users[0].fullname}`,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  this.loading = false;
                }, 500);
                let timeout = 36000000;
                setTimeout(() => {
                  this.$store.commit("STORE_USERINFO", null);
                  this.$router.push("/login");
                }, timeout);
              } else {
                this.Swal.fire({
                  position: "bottom-end",
                  toast: true,
                  icon: "info",
                  title: "Account has been banned please contact administrator",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            } else {
              this.Swal.fire({
                position: "bottom-end",
                toast: true,
                icon: "info",
                title: "Invalid Account",
                showConfirmButton: false,
                timer: 1500,
              });
            }
            this.loading = false;
          }
        });
    },
    loadAccounts() {
      this.loading = true;
      this.axios.get(`${this.api}accounts/loadAccounts`).then((res) => {
        if (res.data) {
          this.Accounts = res.data.filter((rec) => {
            rec.date_created = this.moment(rec.date_created).format(
              "YYYY-MM-DD HH:mm:ss A"
            );
            return rec;
          });
          this.loading = false;
        }
      });
    },
    loadPositions() {
      this.axios.get(`${this.api}accounts/positions`).then((res) => {
        if (res.data)
          this.Positions = res.data.filter((rec) => {
            return rec.position != "Administrator";
          });
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
      reader.readAsDataURL(this.file[0]);
    },
    openDialog(item) {
      this.editedIndex = this.Accounts.indexOf(item);
      this.addObj = { ...item };
      this.addObj.index = this.editedIndex;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.addObj = {};
      this.e1 = 1;
    },
    proceedStepper(i) {
      if (
        !this.addObj.fullname ||
        !this.addObj.position_id ||
        !this.addObj.age ||
        !this.addObj.gender ||
        !this.addObj.address ||
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

<style>
#bg {
  background: url("../assets/img/bg1.jpg");
  background-repeat: no-repeat;
  background-position: auto;
  background-size: cover;
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
</style>
