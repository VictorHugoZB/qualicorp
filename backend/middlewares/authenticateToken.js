const jwt = require("jsonwebtoken");
const sendResponse = require("../src/sendResponse");

function authenticateToken(req, res, next) {
  if (!req.path().startsWith("/todo")) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    sendResponse(res, 401, "UNAUTHORIZED");
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
    }

    if (err) {
      sendResponse(res, 403, "FORBIDDEN");
      return;
    }

    req.user = user;

    next();
  });
}

module.exports = authenticateToken;
