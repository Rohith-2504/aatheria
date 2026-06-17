const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'submissions.db');
const db = new Database(dbPath);

// Create submissions table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Dynamically migrate submissions table to include tier and status columns
try {
  const tableInfo = db.prepare("PRAGMA table_info(submissions)").all();
  const hasTier = tableInfo.some(col => col.name === 'tier');
  const hasStatus = tableInfo.some(col => col.name === 'status');

  if (!hasTier) {
    db.exec("ALTER TABLE submissions ADD COLUMN tier TEXT NOT NULL DEFAULT 'standard'");
    console.log('Migrated submissions table: Added tier column.');
  }
  if (!hasStatus) {
    db.exec("ALTER TABLE submissions ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'");
    console.log('Migrated submissions table: Added status column.');
  }
} catch (err) {
  console.error('Migration error for submissions table:', err);
}

console.log('Database initialized successfully at:', dbPath);

module.exports = db;
