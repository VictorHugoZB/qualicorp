<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-container class="full-width">
        <div class="nav-container">
          <p class="nav-title mb-0">
            Seja muito bem vindo<span v-if="getUsername">{{
              `, ${getUsername}`
            }}</span>
          </p>
          <v-btn v-if="isAtHome" @click="logout">LOGOUT</v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-btn fab fixed bottom right color="primary" @click="addButton"
      ><v-icon large>mdi-plus</v-icon></v-btn
    >
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "App",
  computed: {
    isAtHome() {
      return this.$route.name === "Home";
    },
    getUsername() {
      return this.$store.getters.getUsername;
    },
  },
  methods: {
    ...mapMutations(["setUsername", "setToken"]),
    logout() {
      localStorage.username = "";
      localStorage.token = "";
      this.setUsername(null);
      this.setToken(null);

      this.$router.push("/signin");
    },
    addButton() {
      this.$router.push("/add/todo");
    },
  },
};
</script>

<style>
.nav-title {
  font-size: 1.5rem;
  font-weight: 500;
}
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
