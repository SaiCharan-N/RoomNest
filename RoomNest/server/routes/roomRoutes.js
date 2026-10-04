const express = require('express');
const {
  getRooms,
  getRoomById,
  getMyRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { requireAuth, requireOwner } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getRooms);
router.get('/owner/mine', requireAuth, requireOwner, getMyRooms);
router.get('/:id', getRoomById);
router.post('/', requireAuth, requireOwner, upload.array('images', 6), createRoom);
router.put('/:id', requireAuth, requireOwner, upload.array('images', 6), updateRoom);
router.delete('/:id', requireAuth, requireOwner, deleteRoom);

module.exports = router;
