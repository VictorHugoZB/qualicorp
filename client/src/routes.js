import Vue from "vue";
import VueRouter from "vue-router";
import Signin from "./components/sign/Signin.vue";
import Signup from "./components/sign/Signup.vue";
import store from "./store";
import EditTodo from "./components/Todos/EditTodo.vue";
import AddTodo from "./components/Todos/AddTodo.vue";
import Home from "./components/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/edit/todo/:id",
    name: "EditTodo",
    component: EditTodo,
  },
  {
    path: "/add/todo",
    name: "AddTodo",
    component: AddTodo,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = await store.getters.isLoggedIn;

  console.log(isLoggedIn);

  if (to.name === "Signin" || to.name === "Signup") {
    if (isLoggedIn) {
      return next({ name: "Home" });
    } else {
      return next();
    }
  } else {
    if (!isLoggedIn) {
      return next({ name: "Signin" });
    }
  }

  return next();
});

export default router;
