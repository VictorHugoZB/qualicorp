require("dotenv").config();

const express = require("express");
const routes = require("./routes");
const driver = require("./neo4j/driver");

const app = express();
const port = 3001;

app.use(express.json());
app.use(routes);

driver
  .getServerInfo()
  .then(() => {
    console.log("Conexão neo4j estabelecida");
    app.emit("ready");
  })
  .catch((e) => console.error(e));

app.on("ready", () => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});
