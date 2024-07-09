const driver = require("../../neo4j/driver");

// READ
module.exports.get = async (req, res) => {
  try {
    const { username } = req.user;

    const { records } = await driver.executeQuery(
      "MATCH (u:User {username: $username})-[:CREATED]->(t:Todo) RETURN t",
      { username }
    );

    const todos = records.map((r) => r.get("t").properties);

    return res.status(200).send({ status: "success", payload: todos });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ status: "error", message: e.message });
  }
};

// CREATE
module.exports.create = async (req, res) => {
  try {
    const { username } = req.user;
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .send({ status: "error", message: "Título e descrição obrigatórios" });
    }

    const { records } = await driver.executeQuery(
      `
      MATCH (u:User {username: $username})
      CREATE (t:Todo {title: $title, description: $description, completed: $completed, timestamp: $timestamp, id: randomUUID()})
      CREATE (u)-[:CREATED]->(t)
      RETURN t
      `,
      {
        username,
        title,
        description,
        completed: false,
        timestamp: new Date().getTime(),
      }
    );

    return res.status(200).send({
      status: "success",
      message: "Todo criado com sucesso",
      payload: records[0].get("t").properties,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ status: "error", message: e.message });
  }
};

// UPDATE
module.exports.update = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const { id } = req.params;

    if (!title || !description || completed === undefined) {
      return res.status(400).send({
        status: "error",
        message: "Forneça os campos title, description e completed",
      });
    }

    if (!id) {
      return res
        .status(400)
        .send({ status: "error", message: "ID do todo não foi passado" });
    }

    const { records } = await driver.executeQuery(
      `
      MATCH (t:Todo { id: $id })
      SET t.title = $title,
          t.description = $description,
          t.completed = $completed
      RETURN t
      `,
      {
        id,
        title,
        description,
        completed,
      }
    );

    return res.status(200).send({
      status: "success",
      message: "Todo atualizado com sucesso",
      payload: records[0].get("t").properties,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ status: "error", message: e.message });
  }
};

// DELETE
module.exports.delete = async (req, res) => {
  try {
    const session = driver.session({ database: "neo4j" });
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .send({ status: "error", message: "ID do todo não foi passado" });
    }

    const transaction = await session.beginTransaction();

    await transaction.run(
      `MATCH (t:Todo {id: $id})-[r]-()
       DELETE r`,
      { id }
    );

    await transaction.run(
      `MATCH (t:Todo {id: $id})
       DELETE t`,
      { id }
    );

    await transaction.commit();

    return res.status(200).send({
      status: "success",
      message: "Todo deletado com sucesso",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ status: "error", message: e.message });
  }
};
