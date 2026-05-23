const express = require('express');
const router = express.Router();
const {
  getTrees,
  createTree,
  getTree,
  updateTree,
  deleteTree,
  shareTree,
  getSharedTree,
  updateSharedTree,
} = require('../controllers/treeController');
const { protect } = require('../middleware/auth');

router.get('/shared/:token', getSharedTree);
router.put('/shared/:token', updateSharedTree);

router.use(protect);
router.route('/').get(getTrees).post(createTree);
router.post('/share/:id', shareTree);
router.post('/:id/share', shareTree);
router.route('/:id').get(getTree).put(updateTree).delete(deleteTree);

module.exports = router;
