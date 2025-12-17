import mysql from "mysql2/promise";
import logger from "./logger.js";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,

  rowsAsArray: false,
  jsonStrings: true,

  ...(isProduction && {
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.DB_SSL_CA,
    },
  }),
});

export async function validateDbConnection() {
  try {
    const conn = await db.getConnection();
    conn.release();
    logger.info("[DB] Connection Success.");
  } catch (err) {
    logger.error("[DB] Failed to connect to database.");
    logger.error(err);
    process.exit(1);
  }
}