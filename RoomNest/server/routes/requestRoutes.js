const express = require('express');
const {
  createRequest,
  getUserRequests,
  getOwnerRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { requireAuth, requireOwner, requireSeeker } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, requireSeeker, createRequest);
router.get('/user', requireAuth, requireSeeker, getUserRequests);
router.get('/owner', requireAuth, requireOwner, getOwnerRequests);
router.put('/:id/status', requireAuth, requireOwner, updateRequestStatus);

module.exports = router;
