require('dotenv').config();
const { client, initDb } = require('./db');
const bcrypt = require('bcryptjs');

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const members = [
  { id: 'p1', name: 'George Wilson', gender: 'male', birthDate: '1940', notes: 'Family patriarch', position: { x: 400, y: 40 } },
  { id: 'p2', name: 'Mary Wilson', gender: 'female', birthDate: '1943', notes: 'Family matriarch', position: { x: 620, y: 40 } },
  { id: 'p3', name: 'Robert Wilson', gender: 'male', birthDate: '1965', position: { x: 200, y: 220 } },
  { id: 'p4', name: 'Linda Wilson', gender: 'female', birthDate: '1968', position: { x: 380, y: 220 } },
  { id: 'p5', name: 'Tom Wilson', gender: 'male', birthDate: '1970', position: { x: 600, y: 220 } },
  { id: 'p6', name: 'Alice Wilson', gender: 'female', birthDate: '1995', position: { x: 100, y: 400 } },
  { id: 'p7', name: 'James Wilson', gender: 'male', birthDate: '1997', position: { x: 300, y: 400 } },
  { id: 'p8', name: 'Emma Wilson', gender: 'female', birthDate: '2000', position: { x: 500, y: 400 } },
  { id: 'p9', name: 'Noah Wilson', gender: 'male', birthDate: '2003', position: { x: 700, y: 400 } },
];

const relationships = [
  { id: 'r1', source: 'p1', target: 'p2', relationType: 'husband' },
  { id: 'r2', source: 'p1', target: 'p3', relationType: 'father' },
  { id: 'r3', source: 'p1', target: 'p5', relationType: 'father' },
  { id: 'r4', source: 'p2', target: 'p3', relationType: 'mother' },
  { id: 'r5', source: 'p2', target: 'p5', relationType: 'mother' },
  { id: 'r6', source: 'p3', target: 'p4', relationType: 'husband' },
  { id: 'r7', source: 'p3', target: 'p6', relationType: 'father' },
  { id: 'r8', source: 'p3', target: 'p7', relationType: 'father' },
  { id: 'r9', source: 'p4', target: 'p6', relationType: 'mother' },
  { id: 'r10', source: 'p4', target: 'p7', relationType: 'mother' },
  { id: 'r11', source: 'p5', target: 'p8', relationType: 'father' },
  { id: 'r12', source: 'p5', target: 'p9', relationType: 'father' },
  { id: 'r13', source: 'p3', target: 'p5', relationType: 'brother' },
];

async function seed() {
  try {
    console.log('🔥 Initializing database...');
    await initDb();
    console.log('✅ Database initialized');

    // Clear existing data
    await client.execute('DELETE FROM family_trees');
    await client.execute('DELETE FROM users');

    // Create demo user
    const userId = generateId();
    const hashedPassword = await bcrypt.hash('demo123456', 12);
    const now = new Date().toISOString();
    
    await client.execute({
      sql: 'INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    args: [userId, 'Demo User', 'demo@tree-map.app', hashedPassword, now, now]
    });
    
    console.log('✅ Demo user created: demo@tree-map.app / demo123456');

    // Create sample tree
    const treeId = generateId();
    await client.execute({
      sql: 'INSERT INTO family_trees (id, title, description, owner_id, members, relationships, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [treeId, 'The Wilson Family', 'A sample four-generation family tree', userId, JSON.stringify(members), JSON.stringify(relationships), now, now]
    });
    
    console.log('✅ Sample family tree created');

  console.log('\n🌳 Seed complete! Login with demo@tree-map.app / demo123456');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
