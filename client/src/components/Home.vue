<template>
  <v-container>
    <TodoList />
    <v-btn fab fixed bottom right color="primary" @click="addButton"
      ><v-icon large>mdi-plus</v-icon></v-btn
    >
  </v-container>
</template>

<script>
import TodoList from "./Todos/TodoList.vue";

export default {
  name: "Home",
  components: {
    TodoList,
  },
  methods: {
    addButton() {
      this.$router.push("/add/todo");
    },
  },
};
</script>

<style scoped>
.add-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}
</style>
