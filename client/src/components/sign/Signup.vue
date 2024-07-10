<template>
  <v-card elevation="2" title class="rounded-lg login-card">
    <v-card-title
      >Crie uma conta para começar a gerenciar seus todo's</v-card-title
    >
    <v-card-text>
      <v-form @submit="signup">
        <v-text-field
          label="Nome de usuário"
          outlined
          hide-details="auto"
          class="mb-3"
          v-model="username"
          required
        ></v-text-field>
        <v-text-field
          label="Senha"
          outlined
          hide-details="auto"
          class="mb-3"
          v-model="password"
          type="password"
          required
        ></v-text-field>
        <v-text-field
          label="Confirmar senha"
          outlined
          hide-details="auto"
          class="mb-3"
          v-model="confirmPassword"
          type="password"
          required
        ></v-text-field>
        <v-btn
          color="primary"
          depressed
          elevation="2"
          block
          class="mb-5"
          type="submit"
          :loading="loading"
          :disabled="loading"
          >Criar conta</v-btn
        >
      </v-form>
      <p class="text-center">
        <router-link to="/signin"
          ><v-btn plain color="primary"
            >Já possui conta? Fazer login</v-btn
          ></router-link
        >
      </p>
    </v-card-text>
    <v-alert color="red" type="error" v-if="error.status">{{
      error.message
    }}</v-alert>
  </v-card>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";

export default {
  name: "Signin",

  data: () => {
    return {
      loading: false,
      username: "",
      password: "",
      confirmPassword: "",
      error: {
        status: false,
        message: "",
      },
    };
  },
  methods: {
    ...mapMutations(["setUsername", "setToken"]),
    async signup(e) {
      e.preventDefault();
      this.loading = true;

      try {
        const res = await axios.post("/signup", {
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });

        const {
          user: { username },
          token,
        } = res.data;
        console.log({ username, token });
        this.setUsername(username);
        this.setToken(token);
        localStorage.username = username;
        localStorage.token = token;
        this.error.status = false;
        this.$router.push("/");
      } catch (e) {
        console.error(e);
        this.error.status = true;
        this.error.message =
          e.response?.data?.clientMessage || "Houve um erro no servidor";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.login-card {
  margin: auto;
  max-width: 600px;
  padding: 1.5rem;
  margin-top: 4rem;
}
</style>
