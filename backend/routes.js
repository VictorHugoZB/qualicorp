const express = require("express");
const route = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const driver = require("./neo4j/driver");

route.post("/signin", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.send({ error: "Campos obrigatórios não fornecidos" });
    return;
  }

  const { username, password } = req.body;

  const { records } = await driver.executeQuery(
    "MATCH (u:User {username: $username}) RETURN u.password as password, u.username as username",
    { username }
  );

  if (!records.length) {
    res
      .status(404)
      .send({ status: "error", message: "Usuário não encontrado" });
    return;
  }

  const hash = records[0].get("password");

  bcrypt
    .compare(password, hash)
    .then((correct) => {
      if (correct) {
        res.status(200).send({ status: "sucess", message: "Login efetuado" });
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
      res.status(400).send({
        status: "error",
        message: "Campos obrigatórios não fornecidos",
      });
      return;
    }

    const { username, password, confirmPassword } = req.body;

    if (!username.match(/^[a-z_]+$/)) {
      res.status(400).send({
        status: "error",
        message:
          "Somente letras minúsculas e underline permitidos no nome de usuário",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).send({
        status: "error",
        message: "A senha deve possuir no mínimo 6 caracteres",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).send({
        status: "error",
        message: "Senha e confirmação de senha são diferentes",
      });
      return;
    }

    const { records } = await driver.executeQuery(
      "MATCH (u:User {username: $username}) RETURN u.username",
      { username }
    );

    if (records.length) {
      res.status(409).send({
        status: "error",
        message: "Usuário com esse nome já existe",
      });
      return;
    }

    const hashedPass = await bcrypt.hash(password, saltRounds);

    const user = await driver.executeQuery(
      "CREATE (user:User {username: $username, password: $password}) RETURN user",
      {
        username,
        password: hashedPass,
      }
    );

    res.status(200).send({
      status: "success",
      message: "Usuário criado com sucesso",
      username: user.username,
    });
  } catch (e) {
    console.error(e);
    res.send({ status: "error", message: e.message });
  }
});

module.exports = route;
