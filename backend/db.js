const path = require("path");
const Database = require("better-sqlite3");

// Create or open SQLite database
const dbPath = path.join(__dirname, "inventory.db");
const db = new Database(dbPath);

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    unit TEXT,
    category TEXT,
    brand TEXT,
    stock INTEGER,
    status TEXT,
    image TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS inventory_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    oldStock INTEGER,
    newStock INTEGER,
    changedBy TEXT,
    timestamp TEXT
  );
`);

module.exports = db;
