const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const env = require('./env');

const IN_MEMORY = ':memory:';
const projectRoot = path.resolve(__dirname, '..', '..');

// DATABASE_PATH in .env is relative to the project root (an absolute path also works).
const databaseFile =
  env.databasePath === IN_MEMORY ? IN_MEMORY : path.resolve(projectRoot, env.databasePath);

if (databaseFile !== IN_MEMORY) {
  fs.mkdirSync(path.dirname(databaseFile), { recursive: true });
}

const db = new DatabaseSync(databaseFile);

// SQLite only enforces foreign keys when asked, so we ask on every connection.
db.exec('PRAGMA foreign_keys = ON');
// WAL lets reads continue while a write is happening.
db.exec('PRAGMA journal_mode = WAL');

// Runs work() inside a transaction: everything succeeds together or is rolled back.
// Transactions cannot be nested, so do not call this from inside another transaction.
function runInTransaction(work) {
  db.exec('BEGIN');
  try {
    const result = work();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

module.exports = { db, runInTransaction, databaseFile };