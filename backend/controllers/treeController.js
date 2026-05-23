const { client } = require('../db');

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const mapTreeRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  members: JSON.parse(row.members || '[]'),
  relationships: JSON.parse(row.relationships || '[]'),
  shareToken: row.share_token || null,
  shareAccess: row.share_access || 'private',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

exports.getTrees = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const result = await client.execute({
      sql: 'SELECT id, title, description, members, relationships, share_token, share_access, created_at, updated_at FROM family_trees WHERE owner_id = ? ORDER BY updated_at DESC',
      args: [uid]
    });

    const trees = result.rows.map(mapTreeRow);
    
    res.json({ success: true, trees });
  } catch (err) {
    console.error('Get trees error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTree = async (req, res) => {
  try {
    const { uid } = req.user;
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    
    const treeId = generateId();
    const now = new Date().toISOString();
    
    await client.execute({
      sql: 'INSERT INTO family_trees (id, title, description, owner_id, members, relationships, share_token, share_access, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [treeId, title, description || '', uid, '[]', '[]', null, 'private', now, now]
    });
    
    const tree = { 
      id: treeId, 
      title, 
      description: description || '', 
      members: [], 
      relationships: [],
      shareToken: null,
      shareAccess: 'private',
      createdAt: now,
      updatedAt: now
    };
    
    res.status(201).json({ success: true, tree });
  } catch (err) {
    console.error('Create tree error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTree = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    
    const result = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE id = ? AND owner_id = ?',
      args: [id, uid]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tree not found' });
    }

    const row = result.rows[0];
    res.json({ success: true, tree: mapTreeRow(row) });
  } catch (err) {
    console.error('Get tree error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTree = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const { title, description, members, relationships, shareAccess, shareToken } = req.body;
    
    const now = new Date().toISOString();
    
    // Build update query dynamically
    let sql = 'UPDATE family_trees SET updated_at = ?';
    let args = [now];
    
    if (title !== undefined) {
      sql += ', title = ?';
      args.push(title);
    }
    if (description !== undefined) {
      sql += ', description = ?';
      args.push(description);
    }
    if (members !== undefined) {
      sql += ', members = ?';
      args.push(JSON.stringify(members));
    }
    if (relationships !== undefined) {
      sql += ', relationships = ?';
      args.push(JSON.stringify(relationships));
    }
    if (shareAccess !== undefined) {
      sql += ', share_access = ?';
      args.push(shareAccess);
    }
    if (shareToken !== undefined) {
      sql += ', share_token = ?';
      args.push(shareToken);
    }
    
    sql += ' WHERE id = ? AND owner_id = ?';
    args.push(id, uid);
    
    const result = await client.execute({ sql, args });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, message: 'Tree not found or unauthorized' });
    }

    const updated = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE id = ?',
      args: [id]
    });

    const row = updated.rows[0];
    res.json({ success: true, tree: mapTreeRow(row) });
  } catch (err) {
    console.error('Update tree error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTree = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    
    const result = await client.execute({
      sql: 'DELETE FROM family_trees WHERE id = ? AND owner_id = ?',
      args: [id, uid]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, message: 'Tree not found' });
    }

    res.json({ success: true, message: 'Tree deleted successfully' });
  } catch (err) {
    console.error('Delete tree error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.shareTree = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const { access } = req.body;

    if (!['read', 'read-edit'].includes(access)) {
      return res.status(400).json({ success: false, message: 'Invalid share access' });
    }

    const shareToken = generateId();
    const now = new Date().toISOString();

    const result = await client.execute({
      sql: 'UPDATE family_trees SET share_token = ?, share_access = ?, updated_at = ? WHERE id = ? AND owner_id = ?',
      args: [shareToken, access, now, id, uid]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ success: false, message: 'Tree not found' });
    }

    res.json({ success: true, shareToken, shareAccess: access });
  } catch (err) {
    console.error('Share tree error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSharedTree = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE share_token = ? AND share_access IN (?, ?)',
      args: [token, 'read', 'read-edit']
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Shared tree not found' });
    }

    const row = result.rows[0];
    res.json({ success: true, tree: mapTreeRow(row) });
  } catch (err) {
    console.error('Get shared tree error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSharedTree = async (req, res) => {
  try {
    const { token } = req.params;
    const { title, description, members, relationships } = req.body;

    const existing = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE share_token = ?',
      args: [token]
    });

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Shared tree not found' });
    }

    const current = existing.rows[0];
    if (current.share_access !== 'read-edit') {
      return res.status(403).json({ success: false, message: 'This share link is read-only' });
    }

    const now = new Date().toISOString();
    let sql = 'UPDATE family_trees SET updated_at = ?';
    const args = [now];

    if (title !== undefined) {
      sql += ', title = ?';
      args.push(title);
    }
    if (description !== undefined) {
      sql += ', description = ?';
      args.push(description);
    }
    if (members !== undefined) {
      sql += ', members = ?';
      args.push(JSON.stringify(members));
    }
    if (relationships !== undefined) {
      sql += ', relationships = ?';
      args.push(JSON.stringify(relationships));
    }

    sql += ' WHERE share_token = ?';
    args.push(token);

    await client.execute({ sql, args });

    const updated = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE share_token = ?',
      args: [token]
    });

    res.json({ success: true, tree: mapTreeRow(updated.rows[0]) });
  } catch (err) {
    console.error('Update shared tree error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
