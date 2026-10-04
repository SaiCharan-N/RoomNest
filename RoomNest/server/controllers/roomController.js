const Room = require('../models/Room');

async function getRooms(req, res, next) {
  try {
    const { search, minRent, maxRent, location, roomType, availability, sort } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (roomType) filter.roomType = roomType;
    if (availability !== undefined) filter.availability = availability === 'true';
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rent_asc') sortOption = { rent: 1 };
    if (sort === 'rent_desc') sortOption = { rent: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const rooms = await Room.find(filter).sort(sortOption).populate('owner', 'name email phone');
    res.json({ rooms, count: rooms.length });
  } catch (err) {
    next(err);
  }
}

async function getRoomById(req, res, next) {
  try {
    const room = await Room.findById(req.params.id).populate('owner', 'name email phone');
    if (!room) return res.status(404).json({ message: 'Room not found.' });
    res.json({ room });
  } catch (err) {
    next(err);
  }
}

async function getMyRooms(req, res, next) {
  try {
    const rooms = await Room.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
}

async function createRoom(req, res, next) {
  try {
    const { title, description, rent, location, roomType, amenities, availableFrom, contactNumber } =
      req.body;

    if (!title || !description || !rent || !location || !roomType || !availableFrom || !contactNumber) {
      return res.status(400).json({ message: 'Please fill in all required room fields.' });
    }

    if (Number(rent) <= 0) {
      return res.status(400).json({ message: 'Rent must be a positive number.' });
    }

    const images = (req.files || []).map((file) => `/uploads/${file.filename}`);
    const parsedAmenities = Array.isArray(amenities)
      ? amenities
      : typeof amenities === 'string' && amenities.length
      ? amenities.split(',').map((a) => a.trim())
      : [];

    const room = await Room.create({
      owner: req.user._id,
      title,
      description,
      rent,
      location,
      roomType,
      amenities: parsedAmenities,
      availableFrom,
      contactNumber,
      images,
    });

    res.status(201).json({ room, message: 'Room listed successfully!' });
  } catch (err) {
    next(err);
  }
}

async function updateRoom(req, res, next) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found.' });

    if (String(room.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only edit your own listings.' });
    }

    const { title, description, rent, location, roomType, amenities, availableFrom, contactNumber, availability } =
      req.body;

    if (title) room.title = title;
    if (description) room.description = description;
    if (rent) room.rent = rent;
    if (location) room.location = location;
    if (roomType) room.roomType = roomType;
    if (availableFrom) room.availableFrom = availableFrom;
    if (contactNumber) room.contactNumber = contactNumber;
    if (availability !== undefined) room.availability = availability === 'true' || availability === true;
    if (amenities) {
      room.amenities = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      room.images = [...room.images, ...newImages];
    }

    await room.save();
    res.json({ room, message: 'Room updated successfully!' });
  } catch (err) {
    next(err);
  }
}

async function deleteRoom(req, res, next) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found.' });

    if (String(room.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only delete your own listings.' });
    }

    await room.deleteOne();
    res.json({ message: 'Room deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getRooms, getRoomById, getMyRooms, createRoom, updateRoom, deleteRoom };
