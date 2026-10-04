const express = require('express');
const { getProfile, updateProfile, getOwnerStats } = require('../controllers/userController');
const { requireAuth, requireOwner } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);
router.get('/owner/stats', requireAuth, requireOwner, getOwnerStats);

module.exports = router;
