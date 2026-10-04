const mongoose = require('mongoose');

const ROOM_TYPES = ['Single Room', 'Shared Room', '1 BHK', '2 BHK', 'Apartment', 'Hostel'];

const roomSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    rent: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    roomType: { type: String, enum: ROOM_TYPES, required: true },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    availableFrom: { type: Date, required: true },
    contactNumber: { type: String, required: true },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

roomSchema.index({ title: 'text', location: 'text' });

module.exports = mongoose.model('Room', roomSchema);
module.exports.ROOM_TYPES = ROOM_TYPES;
