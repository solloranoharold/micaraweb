<template>
  <v-container fluid>
    <center v-if="!isHide">
      <v-flex md5 lg5 xs10 sm10>
        <v-card>
          <v-card-title>Generate Report</v-card-title>
          <v-card-text>
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
            <v-btn color="teal accent-4" dark @click="generateReport()"
              >Report</v-btn
            >
          </v-card-text>
        </v-card>
      </v-flex>
    </center>
    <v-simple-table v-else>
      <template v-slot:top>
        <h3 class="text-center">
          List of Visitors for {{ date1 }} to {{ date2 }}
        </h3>
      </template>
      <tbody>
        <tr v-for="(item, i) in datas.items" :key="i">
          <td style="border: 1px solid">{{ item.name }}</td>
          <td style="border: 1px solid">{{ item.calories }}</td>
          <td style="border: 1px solid">{{ item.fat }}</td>
          <td style="border: 1px solid">{{ item.carbs }}</td>
          <td style="border: 1px solid">{{ item.protein }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    date1: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu1: false,
    date2: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    menu2: false,
  }),
  methods: {
    generateReport() {
      if (this.date1 > this.date2) {
        alert("Date 1 is greater than Date 2");
        return false;
      }
      this.loading = true;
      this.$store.commit("HIDE", true);

      console.log("eyyy", this.isHide);
      setTimeout(() => {
        window.print();
      }, 500);
      setTimeout(() => {
        this.$store.commit("HIDE", false);
        console.log("eyyy", this.isHide);
        this.loading = false;
      }, 1000);
    },
  },
};
</script>

<style></style>
