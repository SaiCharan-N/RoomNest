const RentalRequest = require('../models/RentalRequest');
const Room = require('../models/Room');

async function createRequest(req, res, next) {
  try {
    const { roomId, name, email, phone, message, preferredMoveInDate } = req.body;

    if (!roomId || !name || !email || !phone || !preferredMoveInDate) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found.' });

    const request = await RentalRequest.create({
      room: room._id,
      applicant: req.user._id,
      owner: room.owner,
      name,
      email,
      phone,
      message,
      preferredMoveInDate,
    });

    res.status(201).json({ request, message: 'Rental request submitted successfully!' });
  } catch (err) {
    next(err);
  }
}

async function getUserRequests(req, res, next) {
  try {
    const requests = await RentalRequest.find({ applicant: req.user._id })
      .sort({ createdAt: -1 })
      .populate('room', 'title location rent images availability');
    res.json({ requests });
  } catch (err) {
    next(err);
  }
}

async function getOwnerRequests(req, res, next) {
  try {
    const requests = await RentalRequest.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .populate('room', 'title location rent images')
      .populate('applicant', 'name email');
    res.json({ requests });
  } catch (err) {
    next(err);
  }
}

async function updateRequestStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const request = await RentalRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    if (String(request.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only manage requests for your own rooms.' });
    }

    request.status = status;
    await request.save();

    res.json({ request, message: `Request ${status.toLowerCase()}.` });
  } catch (err) {
    next(err);
  }
}

module.exports = { createRequest, getUserRequests, getOwnerRequests, updateRequestStatus };
