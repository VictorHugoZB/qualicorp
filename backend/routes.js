const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const driver = require("./neo4j/driver");
const todoRoutes = require("./todo");
const jwt = require("jsonwebtoken");

function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: 60 * 30,
  });
}

route.post("/signin", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.send({ error: "Campos obrigatórios não fornecidos" });
  }

  const { username, password } = req.body;

  const { records } = await driver.executeQuery(
    "MATCH (u:User {username: $username}) RETURN u.password as password, u.username as username",
    { username }
  );

  if (!records.length) {
    return res
      .status(404)
      .send({ status: "error", message: "Usuário não encontrado" });
  }

  const hash = records[0].get("password");

  bcrypt
    .compare(password, hash)
    .then((correct) => {
      if (correct) {
        const token = generateAccessToken(username);
        res
          .status(200)
          .send({ status: "sucess", message: "Login efetuado", token });
      } else {
        res
          .status(401)
          .send({ status: "error", message: "Credenciais inválidas" });
      }
    })
    .catch((e) => {
      res.status(500).send({ status: "error", message: e.message });
    });
});

route.post("/signup", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password || !req.body.confirmPassword) {
      return res.status(400).send({
        status: "error",
        message: "Campos obrigatórios não fornecidos",
      });
    }

    const { username, password, confirmPassword } = req.body;

    if (!username.match(/^[a-z_]+$/)) {
      return res.status(400).send({
        status: "error",
        message:
          "Somente letras minúsculas e underline permitidos no nome de usuário",
      });
    }

    if (password.length < 6) {
      return res.status(400).send({
        status: "error",
        message: "A senha deve possuir no mínimo 6 caracteres",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({
        status: "error",
        message: "Senha e confirmação de senha são diferentes",
      });
    }

    const { records } = await driver.executeQuery(
      "MATCH (u:User {username: $username}) RETURN u.username",
      { username }
    );

    if (records.length) {
      return res.status(409).send({
        status: "error",
        message: "Usuário com esse nome já existe",
      });
    }

    const hashedPass = await bcrypt.hash(password, saltRounds);

    const user = await driver.executeQuery(
      "CREATE (user:User {username: $username, password: $password}) RETURN user",
      {
        username,
        password: hashedPass,
      }
    );

    const token = generateAccessToken(username);

    res.status(200).send({
      status: "success",
      message: "Usuário criado com sucesso",
      username: user.username,
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ status: "error", message: e.message });
  }
});

// TODOS
route.get("/todo", todoRoutes.get);

module.exports = route;
