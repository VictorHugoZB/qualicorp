require("dotenv").config();

const restify = require("restify");
const driver = require("./neo4j/driver");
const authenticateToken = require("./middlewares/authenticateToken");

const server = restify.createServer();
const port = 3001;

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(authenticateToken);

require("./routes").sign(server);
require("./routes").todo(server);

driver
  .getServerInfo()
  .then(() => {
    console.log("Conexão neo4j estabelecida");
    server.emit("ready");
  })
  .catch((e) => console.error(e));

server.on("ready", () => {
  server.listen(port, function () {
    console.log("Servidor rodando na porta", port);
  });
});
