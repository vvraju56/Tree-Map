const express = require('express');
const router = express.Router();
const { client } = require('../db');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', async (req, res) => {
  try {
    const { uid } = req.user;
    const { treeId, member } = req.body;
    
    const treeResult = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE id = ? AND owner_id = ?',
      args: [treeId, uid]
    });

    if (treeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tree not found' });
    }

    const tree = treeResult.rows[0];
    const members = JSON.parse(tree.members || '[]');
    members.push(member);
    
    const now = new Date().toISOString();
    await client.execute({
      sql: 'UPDATE family_trees SET members = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(members), now, treeId]
    });

    res.status(201).json({ success: true, member });
  } catch (err) {
    console.error('Add member error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:memberId', async (req, res) => {
  try {
    const { uid } = req.user;
    const { treeId, ...updates } = req.body;
    const memberId = req.params.memberId;
    
    const treeResult = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE id = ? AND owner_id = ?',
      args: [treeId, uid]
    });

    if (treeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tree not found' });
    }

    const tree = treeResult.rows[0];
    const members = JSON.parse(tree.members || '[]');
    const memberIndex = members.findIndex(m => m.id === memberId);
    
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    members[memberIndex] = { ...members[memberIndex], ...updates };
    
    const now = new Date().toISOString();
    await client.execute({
      sql: 'UPDATE family_trees SET members = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(members), now, treeId]
    });

    res.json({ success: true, member: members[memberIndex] });
  } catch (err) {
    console.error('Update member error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:memberId', async (req, res) => {
  try {
    const { uid } = req.user;
    const { treeId } = req.body;
    const memberId = req.params.memberId;
    
    const treeResult = await client.execute({
      sql: 'SELECT * FROM family_trees WHERE id = ? AND owner_id = ?',
      args: [treeId, uid]
    });

    if (treeResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tree not found' });
    }

    const tree = treeResult.rows[0];
    const members = JSON.parse(tree.members || '[]');
    const relationships = JSON.parse(tree.relationships || '[]');
    
    const filteredMembers = members.filter(m => m.id !== memberId);
    const filteredRelationships = relationships.filter(
      r => r.source !== memberId && r.target !== memberId
    );
    
    const now = new Date().toISOString();
    await client.execute({
      sql: 'UPDATE family_trees SET members = ?, relationships = ?, updated_at = ? WHERE id = ?',
      args: [JSON.stringify(filteredMembers), JSON.stringify(filteredRelationships), now, treeId]
    });

    res.json({ success: true, message: 'Member deleted' });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;