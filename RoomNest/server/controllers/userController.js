const User = require('../models/User');
const Room = require('../models/Room');
const RentalRequest = require('../models/RentalRequest');

async function getProfile(req, res) {
  res.json({ user: req.user.toSafeObject() });
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    if (name) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;
    await req.user.save();
    res.json({ user: req.user.toSafeObject(), message: 'Profile updated successfully.' });
  } catch (err) {
    next(err);
  }
}

async function getOwnerStats(req, res, next) {
  try {
    const totalListings = await Room.countDocuments({ owner: req.user._id });
    const availableRooms = await Room.countDocuments({ owner: req.user._id, availability: true });
    const rentalRequests = await RentalRequest.countDocuments({ owner: req.user._id });
    const pendingRequests = await RentalRequest.countDocuments({
      owner: req.user._id,
      status: 'Pending',
    });
    res.json({ totalListings, availableRooms, rentalRequests, pendingRequests });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, getOwnerStats };
