const driver = require("../../neo4j/driver");
const sendResponse = require("../sendResponse");

// READ
module.exports.get = async (req, res, next) => {
  try {
    const { username } = req.user;

    const { records } = await driver.executeQuery(
      "MATCH (u:User {username: $username})-[:CREATED]->(t:Todo) RETURN t",
      { username }
    );

    const todos = records.map((r) => r.get("t").properties);

    sendResponse(res, 200, { status: "success", payload: todos });
    return next();
  } catch (e) {
    console.error(e);
    sendResponse(res, 500, {
      status: "error",
      serverMessage: e.message,
      clientMessage: "Ocorreu um erro no servidor.",
    });
    return next();
  }
};

// CREATE
module.exports.create = async (req, res, next) => {
  try {
    const { username } = req.user;
    const { title, description } = req.body;

    if (!title || !description) {
      sendResponse(res, 400, {
        status: "error",
        clientMessage: "Título e descrição obrigatórios",
        serverMessage: "Título e descrição obrigatórios",
      });
      return next();
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

    sendResponse(res, 200, {
      status: "success",
      message: "Todo criado com sucesso",
      payload: records[0].get("t").properties,
    });
    return next();
  } catch (e) {
    console.error(e);
    sendResponse(res, 500, {
      status: "error",
      serverMessage: e.message,
      clientMessage: "Ocorreu um erro no servidor.",
    });
    return next();
  }
};

// UPDATE
module.exports.update = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const { id } = req.params;
    const { username } = req.user;

    if (!title || !description || completed === undefined) {
      sendResponse(res, 400, {
        status: "error",
        clientMessage: "Forneça os campos title, description e completed",
        serverMessage: "Forneça os campos title, description e completed",
      });
      return next();
    }

    if (!id) {
      sendResponse(res, 400, {
        status: "error",
        clientMessage: "ID do todo não foi passado",
        serverMessage: "ID do todo não foi passado",
      });
      return next();
    }

    const { records } = await driver.executeQuery(
      `
      MATCH (t:Todo {id: $id})-[r]-(u:User {username: $username})
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
        username,
      }
    );

    sendResponse(res, 200, {
      status: "success",
      message: "Todo atualizado com sucesso",
      payload: records[0].get("t").properties,
    });
    return next();
  } catch (e) {
    console.error(e);
    sendResponse(res, 500, {
      status: "error",
      serverMessage: e.message,
      clientMessage: "Ocorreu um erro no servidor.",
    });
    return next();
  }
};

// DELETE
module.exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.user;

    if (!id) {
      sendResponse(res, 400, {
        status: "error",
        clientMessage: "ID do todo não foi passado",
        serverMessage: "ID do todo não foi passado",
      });
      return next();
    }

    await driver.executeQuery(
      `MATCH (t:Todo {id: $id})-[r]-(u:User {username: $username})
       DELETE r
       DELETE t`,
      { id, username }
    );

    sendResponse(res, 200, {
      status: "success",
      message: "Todo deletado com sucesso",
    });
    return next();
  } catch (e) {
    console.error(e);
    sendResponse(res, 500, {
      status: "error",
      serverMessage: e.message,
      clientMessage: "Ocorreu um erro no servidor.",
    });
    return next();
  }
};
