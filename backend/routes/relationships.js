const express = require('express');
const router = express.Router();
const { client } = require('../db');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const { uid } = req.user;
    const { treeId, relationship } = req.body;
    
    const treeResult = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE id = ? AND owner_id = ?',
      args: [treeId, uid]
    });

    if (treeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tree not found' });
    }

    const tree = treeResult.rows[0];
    const relationships = JSON.parse(tree.relationships || '[]');
    relationships.push(relationship);
    
    const now = new Date().toISOString();
    await client.execute({
      sql: 'UPDATE family_trees SET relationships = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(relationships), now, treeId]
    });

    res.status(201).json({ success: true, relationship });
  } catch (err) {
    console.error('Add relationship error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:relId', async (req, res) => {
  try {
    const { uid } = req.user;
    const { treeId } = req.body;
    const relId = req.params.relId;
    
    const treeResult = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE id = ? AND owner_id = ?',
      args: [treeId, uid]
    });

    if (treeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tree not found' });
    }

    const tree = treeResult.rows[0];
    const relationships = JSON.parse(tree.relationships || '[]');
    const filteredRelationships = relationships.filter(r => r.id !== relId);
    
    const now = new Date().toISOString();
    await client.execute({
      sql: 'UPDATE family_trees SET relationships = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(filteredRelationships), now, treeId]
    });

    res.json({ success: true, message: 'Relationship deleted' });
  } catch (err) {
    console.error('Delete relationship error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;