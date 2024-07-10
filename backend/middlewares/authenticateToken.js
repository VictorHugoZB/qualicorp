const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  if (!req.path().startsWith("/todo")) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401);
    res.send("UNAUTHORIZED");
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) {
      res.status(403);
      res.send("FORBIDDEN");
      return;
    }

    req.user = user;

    next();
  });
}

module.exports = authenticateToken;
