const restify = require("restify");
const route = restify.Router;
const todoRoutes = require("./src/todo");
const signRoutes = require("./src/sign");

// SIGN
module.exports.sign = function (server) {
  server.post("/signin", signRoutes.signin);
  server.post("/signup", signRoutes.signup);
  server.post("/validate-login", signRoutes.isLoggedIn);
};

// TODOS
module.exports.todo = function (server) {
  server.get("/todo", todoRoutes.get);
  server.get("/todo/:id", todoRoutes.getById);
  server.post("/todo", todoRoutes.create);
  server.put("/todo/:id", todoRoutes.update);
  server.del("/todo/:id", todoRoutes.delete);
};
