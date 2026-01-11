import { Sequelize } from "sequelize";

const dbName = process.env.DB_NAME || "tasks_db";
const dbUser = process.env.DB_USER || "root";
const dbPass = process.env.DB_PASS || "password";
const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbPort = process.env.DB_PORT || "3306";

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: "mysql",
  logging: false,
});
