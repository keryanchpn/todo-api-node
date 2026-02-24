const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "todo.db");

let db;

/**
 * Initializes and returns the SQLite database instance.
 * Reads from disk if a database file exists, otherwise creates a new one in memory.
 * Creates the 'todos' table if it does not exist.
 * @returns {Promise<SQL.Database>} The initialized database instance.
 */
async function getDb() {
  if (db) return db;
  console.log("initializing database connection")
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending'
    )
  `);
  return db;
}

/**
 * Exports the current state of the in-memory database and writes it to disk.
 * This persists changes made to the database.
 */
function saveDb() {
  if (db) {
    console.log("saving database to disk")
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

module.exports = { getDb, saveDb };
