<template>
  <v-container>
    <TodoList />
  </v-container>
</template>

<script>
import TodoList from "./Todos/TodoList.vue";

export default {
  name: "Home",
  components: {
    TodoList,
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
