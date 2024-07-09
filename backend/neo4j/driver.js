const neo4j = require("neo4j-driver");
const { DB_URL, DB_USERNAME, DB_PASSWORD } = process.env;
const driver = neo4j.driver(DB_URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));

module.exports = driver;
