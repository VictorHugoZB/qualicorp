const bcrypt = require("bcrypt");
const saltRounds = 10;
const driver = require("../../neo4j/driver");
const jwt = require("jsonwebtoken");
const sendResponse = require("../sendResponse");

function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: 60 * 30,
  });
}

module.exports.signin = async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    sendResponse(res, 400, {
      status: "error",
      message: "Campos obrigatórios não fornecidos",
    });
    return next();
  }

  const { username, password } = req.body;

  const { records } = await driver.executeQuery(
    "MATCH (u:User {username: $username}) RETURN u.password as password, u.username as username",
    { username }
  );

  if (!records.length) {
    sendResponse(res, 404, {
      status: "error",
      message: "Usuário não encontrado",
    });
    return next();
  }

  const hash = records[0].get("password");

  bcrypt
    .compare(password, hash)
    .then((correct) => {
      if (correct) {
        const token = generateAccessToken(username);
        sendResponse(res, 200, {
          status: "sucess",
          message: "Login efetuado",
          token,
        });
      } else {
        sendResponse(res, 401, {
          status: "error",
          message: "Credenciais inválidas",
        });
      }
      return next();
    })
    .catch((e) => {
      sendResponse(res, 500, { status: "error", message: e.message }, res);
      return next();
    });
};

module.exports.signup = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password || !req.body.confirmPassword) {
      sendResponse(res, 400, {
        status: "error",
        message: "Campos obrigatórios não fornecidos",
      });
      return next();
    }

    const { username, password, confirmPassword } = req.body;

    if (!username.match(/^[a-z_]+$/)) {
      sendResponse(res, 400, {
        status: "error",
        message:
          "Somente letras minúsculas e underline permitidos no nome de usuário",
      });
      return next();
    }

    if (password.length < 6) {
      sendResponse(res, 400, {
        status: "error",
        message: "A senha deve possuir no mínimo 6 caracteres",
      });
      return next();
    }

    if (password !== confirmPassword) {
      sendResponse(res, 400, {
        status: "error",
        message: "Senha e confirmação de senha são diferentes",
      });
      return next();
    }

    const { records } = await driver.executeQuery(
      "MATCH (u:User {username: $username}) RETURN u.username",
      { username }
    );

    if (records.length) {
      sendResponse(res, 409, {
        status: "error",
        message: "Usuário com esse nome já existe",
      });
      return next();
    }

    const hashedPass = await bcrypt.hash(password, saltRounds);

    await driver.executeQuery(
      "CREATE (user:User {username: $username, password: $password})",
      {
        username,
        password: hashedPass,
      }
    );

    const token = generateAccessToken(username);

    sendResponse(res, 200, {
      status: "success",
      message: "Usuário criado com sucesso",
      token,
    });
    return next();
  } catch (e) {
    console.error(e);
    sendResponse(res, 500, { status: "error", message: e.message });
    return next();
  }
};
