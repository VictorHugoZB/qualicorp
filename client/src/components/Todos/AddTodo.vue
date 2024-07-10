<template>
  <v-container max-width="600" class="mx-auto">
    <v-form class="mb-5" @submit="add">
      <v-text-field label="Título do Todo" v-model="title"></v-text-field>
      <v-textarea
        label="Descrição do Todo"
        v-model="description"
        no-resize
      ></v-textarea>
      <v-btn block color="primary" type="submit" :loading="loading"
        >Adicionar</v-btn
      >
    </v-form>
    <v-alert color="red" type="error" v-if="error.status">{{
      error.message
    }}</v-alert>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "AddTodo",

  data: () => {
    return {
      loading: false,
      title: "",
      description: "",
      error: {
        status: false,
        message: "",
      },
    };
  },
  methods: {
    async add(e) {
      e.preventDefault();
      this.loading = true;
      try {
        await axios.post(
          "/todo",
          {
            title: this.title,
            description: this.description,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );

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
