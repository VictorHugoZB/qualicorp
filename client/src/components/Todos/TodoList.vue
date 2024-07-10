<template>
  <v-card max-width="600" class="mx-auto mt-5" tile>
    <div v-if="loading" class="pa-5">Carregando...</div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div
      class="pa-5"
      v-if="
        !!todosPendentes &&
        !todosPendentes.length &&
        !!todosConcluidos &&
        !todosConcluidos.length
      "
    >
      <p>
        Nenhum Todo cadastrado... Comece a cadastrar seus todos cadastrar seus
        todos agora!
      </p>
      <v-btn color="primary" @click="goToAdd">Cadastrar</v-btn>
    </div>

    <div v-if="!!todosPendentes && !!todosPendentes.length">
      <h2 class="pa-3">Todos pendentes</h2>
      <v-list flat>
        <TodoItem
          v-for="todo in todosPendentes"
          :key="todo.title"
          :todo="todo"
        />
      </v-list>
    </div>

    <div v-if="!!todosConcluidos && !!todosConcluidos.length">
      <h2 class="pa-3">Todos concluídos</h2>
      <v-list flat>
        <TodoItem
          v-for="todo in todosConcluidos"
          :key="todo.title"
          :todo="todo"
        />
      </v-list>
    </div>
  </v-card>
</template>

<script>
import axios from "axios";
import TodoItem from "./TodoItem.vue";

export default {
  name: "TodoList",
  components: {
    TodoItem,
  },
  created() {
    this.fetchData();
  },
  data: () => ({
    loading: false,
    todosConcluidos: null,
    todosPendentes: null,
    error: null,
  }),
  methods: {
    async fetchData() {
      try {
        this.error = this.todos = null;
        this.loading = true;

        const res = await axios.get("/todo", {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });

        const data = res.data.payload;
        this.error = null;
        this.todosConcluidos = data.filter((t) => !!t.completed);
        this.todosPendentes = data.filter((t) => !t.completed);
        this.loading = false;
      } catch (e) {
        console.error(e);
        this.loading = false;
        this.error =
          e.response?.data?.clientMessage || "Houve um erro no servidor";
      }
    },
    goToAdd() {
      this.$router.push("/add/todo");
    },
  },
};
</script>
