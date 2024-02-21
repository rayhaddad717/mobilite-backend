import CONSTANT from "./config";

const { Sequelize } = require("sequelize");
const database = new Sequelize(
  `postgres://${CONSTANT.DB_USERNAME}:${CONSTANT.DB_PASSWORD}@localhost:${CONSTANT.DB_PORT}/${CONSTANT.DB_NAME}`
);

export default database;
