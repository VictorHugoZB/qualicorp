import Vue from "vue";
import VueRouter from "vue-router";
import Signin from "./components/sign/Signin.vue";
import Signup from "./components/sign/Signup.vue";
import HelloWorld from "./components/HelloWorld.vue";
import store from "./store";

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
    component: HelloWorld,
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
  }

  if (to.name === "Home" && !isLoggedIn) {
    return next({ name: "Signin" });
  }

  return next();
});

export default router;
