const driver = require("../neo4j/driver");

module.exports.get = (req, res) => {
  const user = req.user;
  console.log(user);
  res.send("ok");
};
