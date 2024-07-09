const express = require("express");
const route = express.Router();
const todoRoutes = require("./src/todo");
const signRoutes = require("./src/sign");

// SIGN
route.post("/signin", signRoutes.signin);
route.post("/signup", signRoutes.signup);

// TODOS
route.get("/todo", todoRoutes.get);
route.post("/todo", todoRoutes.create);
route.put("/todo/:id", todoRoutes.update);
route.delete("/todo/:id", todoRoutes.delete);

module.exports = route;
