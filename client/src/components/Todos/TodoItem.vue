<template>
  <v-list-item two-line :loading="loading">
    <v-list-item-content>
      <v-row class="min-height px-5" align="center">
        <v-col cols="12" sm="1">
          <v-checkbox
            v-model="todo.completed"
            @change="toggleCompleted"
          ></v-checkbox>
        </v-col>
        <v-col cols="12" sm="7">
          <v-list-item-title>{{ todo.title }}</v-list-item-title>
          <v-list-item-subtitle>{{
            truncateText(todo.description)
          }}</v-list-item-subtitle>
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn plain @click="edit"
            ><v-icon color="blue darken-2"> mdi-note-edit </v-icon></v-btn
          >
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn plain :loading="deleting" @click="deleteTodo"
            ><v-icon color="red darken-2"> mdi-delete </v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import axios from "axios";

export default {
  props: ["todo"],
  data: () => {
    return {
      deleting: false,
      loading: false,
    };
  },
  methods: {
    truncateText(text) {
      if (text.length > 50) {
        return text.slice(50) + "...";
      } else {
        return text;
      }
    },
    edit() {
      this.$router.push(`/edit/todo/${this.todo.id}`);
    },
    async toggleCompleted() {
      this.loading = true;
      const currentCompleted = this.todo.completed;

      await axios.put(
        `/todo/${this.todo.id}`,
        {
          title: this.todo.title,
          description: this.todo.description,
          completed: currentCompleted,
        },
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        }
      );

      this.loading = false;
      this.$router.go();
    },
    async deleteTodo() {
      this.deleting = true;

      await axios.delete(`/todo/${this.todo.id}`, {
        headers: {
          Authorization: `Bearer ${this.$store.state.token}`,
        },
      });

      this.deleting = false;
      this.$router.go();
    },
  },
};
</script>
