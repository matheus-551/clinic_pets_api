import mysql from "mysql2/promise";
import logger from "./logger.js";
import "dotenv/config";

export const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  rowsAsArray: false, 
  jsonStrings: true
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