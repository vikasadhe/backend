const mysql = require("mysql2/promise");

const requiredEnv = ["DB_HOST", "DB_USER", "DB_NAME"];

function validateDatabaseConfig() {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing database environment variables: ${missing.join(", ")}`,
    );
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

async function connectDB() {
  validateDatabaseConfig();

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.ping();

    console.log("MySQL connected successfully.");
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = { pool, connectDB };
