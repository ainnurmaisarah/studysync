const fs = require('fs');
const path = require('path');
const { db, databaseFile } = require('../config/database');

const schemaPath = path.join(__dirname, 'schema.sql');

function initialiseDatabase() {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);

  const tables = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    )
    .all();
  const foreignKeys = db.prepare('PRAGMA foreign_keys').get();

  console.log(`Database ready: ${databaseFile}`);
  console.log(`Foreign keys enforced: ${foreignKeys.foreign_keys === 1 ? 'yes' : 'NO'}`);
  console.log(`Tables (${tables.length}): ${tables.map((table) => table.name).join(', ')}`);
}

try {
  initialiseDatabase();
} finally {
  db.close();
}