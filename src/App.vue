<template>
  <v-app>
    <v-app-bar
      v-if="isHide == false && userInfo != null && isShow == false"
      app
      dark
      class="teal accent-4"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-5"
          contain
          src="./assets/img/micaraland-logo-final.png"
          transition="scale-transition"
          width="250"
        />
      </div>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="userInfo.position == 'Administrator'"
            icon
            dark
            v-bind="attrs"
            v-on="on"
            @click="$router.push('/about')"
          >
            <v-icon x-large>mdi-information</v-icon>
          </v-btn>
        </template>
        <span>ABOUT US</span>
      </v-tooltip>
    </v-app-bar>
    <v-footer id="footer" inset app dark padless v-if="!userInfo">
      <v-card flat tile class="cyan darken-4 flex text-center">
        <v-card-text>
          <v-row no-gutters>
            <v-col md="6" lg="6">
              <h4 class="pa-2 text-center" style="text-decoration: underline">
                ABOUT US
              </h4>

              Micara Estates - Tanza is a 70 hectares property land developed by
              Property of Friends Inc. situated along Antero Soriano Highway
              Brgy. Sahud-Ulan Tanza, Cavite.
            </v-col>
            <v-col md="6" lg="6">
              <h4 class="pa-2 text-center" style="text-decoration: underline">
                CONTACT US
              </h4>
              Viber | Whatsapp | WeChat | IMO | Skype<br />
              +63917-512-5471 (Globe) | +63998-978-9039 (Smart)
              <br />

              EMAIL US AT: micaracavite@gmail.com
            </v-col>
            <v-col md="12" lg="12">
              <v-btn
                small
                v-for="(icon, i) in icons"
                :key="i"
                class="mx-4 white--text"
                text
                @click="openLink(icon.link)"
              >
                <v-icon>
                  {{ icon.icon }}
                </v-icon>
                {{ icon.name }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-footer>
    <!-- NAVBAR -->
    <v-navigation-drawer
      v-if="userInfo != null && isShow == false"
      v-model="drawer"
      app
      width="250"
    >
      <div class="d-flex align-center">
        <v-img
          aspect-ratio="1"
          alt="Profile"
          :src="`${ftp}users/${userInfo.profile_img}`"
        ></v-img>
      </div>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ userInfo.fullname }}</v-list-item-title
            >
            <v-list-item-subtitle>{{ userInfo.position }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group
          active-class="teal accent-2 --text text--accent-2"
          v-if="userInfo.position == 'Administrator'"
        >
          <v-list-item v-for="(item, i) in admin" :key="i" :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group
          active-class="teal accent-2 --text text--accent-2"
          v-if="userInfo.position == 'Security Guard'"
        >
          <v-list-item v-for="(item, i) in guard" :key="i" :to="item.to">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <v-list-item to="/homeowner">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item @click="dialog = !dialog">
          <v-list-item-icon>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-title>MY ACCOUNT</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout()">
          <v-list-item-icon>
            <v-icon>mdi-power</v-icon>
          </v-list-item-icon>
          <v-list-item-title>LOGOUT</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="500px"
      persistent
      v-if="userInfo"
    >
      <v-card>
        <v-toolbar flat dense dark color="teal accent-4">
          <v-toolbar-title>My Account</v-toolbar-title>
          <v-spacer />
          <v-icon @click="dialog = !dialog">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-btn
              dark
              color="teal darken-4"
              dense
              x-small
              @click="type = 'info'"
              ><v-icon small>mdi-account</v-icon>Information</v-btn
            >
            <v-btn
              dense
              dark
              color="teal darken-4"
              x-small
              @click="type = 'password'"
              ><v-icon small>mdi-account</v-icon>Change Password</v-btn
            >
            <br /><br />
            <div v-if="type == 'info'">
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
                  <v-img
                    aspect-ration="2"
                    :src="img ? img : `${ftp}users/${userInfo.profile_img}`"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    dense
                    v-model="userInfo.fullname"
                    rounded
                    outlined
                    label="Fullname"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="userInfo.position_id"
                    :items="Positions"
                    readonly
                    item-text="position"
                    item-value="position_id"
                    dense
                    rounded
                    outlined
                    label="Position"
                    append-icon="mdi-note"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-text-field
                    dense
                    v-model="userInfo.age"
                    rounded
                    type="number"
                    min="1"
                    outlined
                    label="Age"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-autocomplete
                    v-model="userInfo.gender"
                    :items="['M', 'F']"
                    dense
                    rounded
                    outlined
                    label="Gender"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="userInfo.address"
                    dense
                    rounded
                    outlined
                    label="Blk/Lot/Street/City"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="userInfo.contactno"
                    dense
                    rounded
                    outlined
                    label="Contact No"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
            <div v-else-if="type == 'password'">
              <v-text-field
                dense
                rounded
                outlined
                v-model="changePass.password"
                label="New Password"
                type="password"
              ></v-text-field>
              <v-text-field
                dense
                rounded
                outlined
                type="password"
                v-model="changePass.cpass"
                label="Confirm Password"
              ></v-text-field>
            </div>
            <v-btn
              v-if="type"
              block
              dark
              color="teal darken-4"
              small
              @click="updateAccount()"
              >UPDATE</v-btn
            >
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-main>
      <!-- <v-toolbar flat dense v-if="userInfo != null && isShow == false">
        <v-btn x-small dark color="teal darken-2" @click="dialog = !dialog">
          <v-icon>mdi-account-circle</v-icon>My Account
        </v-btn>
        <v-btn x-small dark color="teal darken-2" @click="logout()">
          <v-icon>mdi-power</v-icon>Logout
        </v-btn>
      </v-toolbar> -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  watch: {
    isHide(val) {
      this.drawer = !val;
    },
  },
  data: () => ({
    icons: [
      {
        icon: "mdi-facebook",
        link: "https://www.facebook.com/MicaraTanza1",
        name: "facebook.com/MicaraTanza1",
      },
    ],
    Positions: [],
    img: null,
    file: null,
    type: "info",
    changePass: {
      password: "",
      cpass: "",
    },
    drawer: true,
    dialog: false,
    admin: [
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
    guard: [
      {
        title: "Monitoring Dashboard",
        icon: "mdi-monitor-dashboard",
        to: "/monitoring",
      },
    ],
  }),
  created() {
    // this.$store.commit("STORE_DATA", this.temp);
    this.loadPositions();
  },
  methods: {
    openLink(link) {
      window.open(link, "_blank");
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
      reader.readAsDataURL(
        this.file ? this.file[0] : this.userInfo.profile_img
      );
    },
    loadPositions() {
      this.axios.get(`${this.api}accounts/positions`).then((res) => {
        if (res.data)
          this.Positions = res.data.filter((rec) => {
            if (this.userInfo && this.userInfo.position == "Administrator")
              return rec;
            if (this.userInfo && this.userInfo.position == "Security Guard")
              return rec.position == "Home Owner";
            else return rec;
          });
      });
    },
    updateAccount() {
      if (this.type == "password") {
        if (!this.changePass.password || !this.changePass.cpass) {
          this.Swal.fire({
            position: "bottom-end",
            toast: true,
            icon: "error",
            title: "Please complete fields",
            showConfirmButton: false,
            timer: 1500,
          });
          return false;
        }
        if (
          this.changePass.password.toUpperCase() ==
          this.changePass.cpass.toUpperCase()
        ) {
          this.userInfo.password = this.changePass.password;
        } else {
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
        title: `Are you sure you want to update ${this.type}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00796B",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes,update it!`,
      }).then((result) => {
        if (result.isConfirmed) {
          let formData = new FormData();
          this.userInfo.profile_img = this.file
            ? `${this.userInfo.username}_${this.moment().format(
                "YYYYMMDDHHmmss"
              )}.${this.file[0].name.split(".")[1]}`
            : this.userInfo.profile_img
            ? this.userInfo.profile_img
            : "";

          if (this.file) {
            formData.append("myData", JSON.stringify(this.userInfo));
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
            .post(`${this.api}accounts/insertUpdateAccounts`, this.userInfo)
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
                this.changePass = {};
                this.dialog = false;
                this.$store.commit("STORE_USERINFO", this.userInfo);
              }
            });
        }
      });
    },
    logout() {
      if (confirm("Are you sure you want to logout ? ")) {
        setTimeout(() => {
          this.$store.commit("STORE_USERINFO", null);
          this.$router.push("/login");
          alert("YOU ARE NOW LOGGED OUT");
        }, 1000);
      }
    },
  },
};
</script>
<style scoped>
#footer {
  position: fixed;
  bottom: 0;
}
@media (max-width: 960px) {
  #footer {
    display: none;
  }
}
</style>
