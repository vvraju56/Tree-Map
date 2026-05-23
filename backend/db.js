const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'libsql://tree-vvraju.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS family_trees (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      owner_id TEXT NOT NULL,
      members TEXT DEFAULT '[]',
      relationships TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    )
  `);

  const schema = await client.execute('PRAGMA table_info(family_trees)');
  const columns = new Set(schema.rows.map((row) => row.name));

  if (!columns.has('share_token')) {
    await client.execute('ALTER TABLE family_trees ADD COLUMN share_token TEXT');
  }

  if (!columns.has('share_access')) {
    await client.execute("ALTER TABLE family_trees ADD COLUMN share_access TEXT DEFAULT 'private'");
  }

  console.log('✅ Database tables initialized');
}

module.exports = { client, initDb };
