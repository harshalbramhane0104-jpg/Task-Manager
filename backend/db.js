const mysql = require("mysql2/promise");

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || "libuser";
const DB_PASSWORD = process.env.DB_PASSWORD || "libpass";
const DB_NAME = process.env.DB_NAME || "librarydb";

let pool;

async function initDb(maxRetries = 15, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      pool = mysql.createPool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
      });

      // Test the connection
      const conn = await pool.getConnection();
      conn.release();

      // Create the books table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS books (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255) NOT NULL,
          read_status BOOLEAN DEFAULT FALSE
        )
      `);

      console.log("Database connected and table ready.");
      return pool;
    } catch (err) {
      console.log(`DB not ready (attempt ${attempt}/${maxRetries}): ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error("Could not connect to the database after multiple retries.");
}

function getPool() {
  if (!pool) throw new Error("Database pool not initialized yet.");
  return pool;
}

module.exports = { initDb, getPool };
