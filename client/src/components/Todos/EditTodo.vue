<template>
  <v-container max-width="600" class="mx-auto">
    <div v-if="fetching" class="pa-5">Carregando...</div>
    <v-container v-if="!fetching">
      <p v-if="timestamp" class="my-5">
        Criado em: {{ new Date(timestamp).toLocaleDateString() }}
      </p>
      <v-form class="mb-5" @submit="edit">
        <v-text-field
          outlined
          label="Título do Todo"
          v-model="title"
        ></v-text-field>
        <v-textarea
          outlined
          label="Descrição do Todo"
          v-model="description"
          no-resize
        ></v-textarea>
        <v-checkbox v-model="completed" label="Completo"></v-checkbox>
        <v-btn block color="primary" type="submit" :loading="loading"
          >Editar</v-btn
        >
      </v-form>
      <v-alert color="red" type="error" v-if="error.status">{{
        error.message
      }}</v-alert>
      <v-alert color="green" type="success" v-if="success"
        >Atualizado com sucesso</v-alert
      >
    </v-container>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "EditTodo",

  data: () => {
    return {
      fetching: false,
      loading: false,
      title: "",
      description: "",
      completed: false,
      timestamp: null,
      success: false,
      error: {
        status: false,
        message: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async edit(e) {
      e.preventDefault();
      this.loading = true;
      this.success = false;
      try {
        await axios.put(
          `/todo/${this.$route.params.id}`,
          {
            title: this.title,
            description: this.description,
            completed: this.completed,
          },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        );

        this.success = true;
        this.fetchData();
      } catch (e) {
        console.error(e);
        this.error.status = true;
        this.error.message =
          e.response?.data?.clientMessage || "Houve um erro no servidor";
      } finally {
        this.loading = false;
      }
    },
    async fetchData() {
      try {
        this.fetching = true;

        const res = await axios.get(`/todo/${this.$route.params.id}`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });

        const todo = res.data.payload;

        this.title = todo.title;
        this.description = todo.description;
        this.timestamp = todo.timestamp;
        this.completed = todo.completed;

        this.error.status = false;
      } catch (e) {
        console.error(e);
        this.error.status = true;
        this.error.message =
          e.response?.data?.clientMessage || "Houve um erro no servidor";
      } finally {
        this.fetching = false;
      }
    },
  },
};
</script>
