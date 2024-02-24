import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const HTTP_RESPONSES = {
  OK: <T>(data: T, message: string) => ({
    statusCode: 200,
    data,
    message,
  }),
  CREATED: <T>(data: T, message: string) => ({
    statusCode: 201,
    data,
    message,
  }),
  ERROR: (message: string) => ({
    statusCode: 500,
    message,
  }),
};
const CONSTANT = Object.freeze({
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  HTTP_RESPONSES: HTTP_RESPONSES,
});
export default CONSTANT;
