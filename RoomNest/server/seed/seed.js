require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Room = require('../models/Room');
const RentalRequest = require('../models/RentalRequest');
const ContactMessage = require('../models/ContactMessage');

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
];

const LOCATIONS = ['Gachibowli', 'Madhapur', 'Kondapur', 'Kukatpally', 'Hitech City', 'Miyapur'];

async function seed() {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Room.deleteMany({}),
    RentalRequest.deleteMany({}),
    ContactMessage.deleteMany({}),
  ]);

  console.log('Creating demo accounts...');
  const owner = await User.create({
    name: 'Ravi Kumar',
    email: 'owner@roomnest.com',
    password: 'Owner@123',
    role: 'owner',
    phone: '9876543210',
  });

  const secondOwner = await User.create({
    name: 'Priya Sharma',
    email: 'owner2@roomnest.com',
    password: 'Owner@123',
    role: 'owner',
    phone: '9876500011',
  });

  const seeker = await User.create({
    name: 'Amit Verma',
    email: 'user@roomnest.com',
    password: 'User@123',
    role: 'seeker',
    phone: '9123456780',
  });

  console.log('Creating sample rooms...');
  const roomsData = [
    {
      owner: owner._id,
      title: 'Modern Single Room Near Metro',
      description:
        'A cozy, well-lit single room ideal for working professionals. Close to the metro station with easy access to IT hubs.',
      rent: 9500,
      location: 'Gachibowli, Hyderabad',
      roomType: 'Single Room',
      amenities: ['WiFi', 'AC', 'Furnished', 'Attached Bathroom'],
      availableFrom: new Date('2026-09-01'),
      contactNumber: '9876543210',
      images: [PLACEHOLDER_IMAGES[0]],
    },
    {
      owner: owner._id,
      title: '2 BHK Near Metro Station',
      description:
        'Spacious 2 BHK apartment perfect for small families or roommates sharing. Fully furnished with modern amenities.',
      rent: 22000,
      location: 'Kukatpally, Hyderabad',
      roomType: '2 BHK',
      amenities: ['WiFi', 'Parking', 'Furnished', 'Kitchen', 'AC'],
      availableFrom: new Date('2026-09-15'),
      contactNumber: '9876543210',
      images: [PLACEHOLDER_IMAGES[1]],
    },
    {
      owner: secondOwner._id,
      title: 'Fully Furnished Student Room',
      description:
        'Affordable room tailored for students, walking distance to university campus and cafes.',
      rent: 7000,
      location: 'Kondapur, Hyderabad',
      roomType: 'Single Room',
      amenities: ['WiFi', 'Furnished', 'Laundry'],
      availableFrom: new Date('2026-09-05'),
      contactNumber: '9876500011',
      images: [PLACEHOLDER_IMAGES[2]],
    },
    {
      owner: secondOwner._id,
      title: 'Budget Shared Room',
      description: 'Economical shared room, great for students or early-career professionals on a budget.',
      rent: 5500,
      location: 'Miyapur, Hyderabad',
      roomType: 'Shared Room',
      amenities: ['WiFi', 'Parking'],
      availableFrom: new Date('2026-09-01'),
      contactNumber: '9876500011',
      images: [PLACEHOLDER_IMAGES[3]],
    },
    {
      owner: owner._id,
      title: 'Premium Apartment with City View',
      description:
        'Premium apartment with excellent amenities, ideal for executives who want comfort and convenience.',
      rent: 35000,
      location: 'Hitech City, Hyderabad',
      roomType: 'Apartment',
      amenities: ['WiFi', 'Parking', 'AC', 'Furnished', 'Kitchen', 'Laundry'],
      availableFrom: new Date('2026-10-01'),
      contactNumber: '9876543210',
      images: [PLACEHOLDER_IMAGES[4]],
    },
    {
      owner: secondOwner._id,
      title: 'Cozy 1 BHK Close to Offices',
      description: 'A comfortable 1 BHK unit close to major tech parks, ideal for a single working professional.',
      rent: 15500,
      location: 'Madhapur, Hyderabad',
      roomType: '1 BHK',
      amenities: ['WiFi', 'AC', 'Furnished', 'Attached Bathroom', 'Kitchen'],
      availableFrom: new Date('2026-09-20'),
      contactNumber: '9876500011',
      images: [PLACEHOLDER_IMAGES[5]],
    },
    {
      owner: owner._id,
      title: 'Hostel Bed for Students',
      description: 'Clean and secure hostel accommodation with mess facility and 24x7 security.',
      rent: 6500,
      location: 'Kukatpally, Hyderabad',
      roomType: 'Hostel',
      amenities: ['WiFi', 'Laundry'],
      availableFrom: new Date('2026-09-01'),
      contactNumber: '9876543210',
      images: [PLACEHOLDER_IMAGES[0]],
    },
    {
      owner: secondOwner._id,
      title: 'Spacious 2 BHK Family Apartment',
      description: 'Family-friendly 2 BHK apartment in a quiet residential neighborhood with parking.',
      rent: 24500,
      location: 'Gachibowli, Hyderabad',
      roomType: '2 BHK',
      amenities: ['WiFi', 'Parking', 'Furnished', 'AC'],
      availableFrom: new Date('2026-10-10'),
      contactNumber: '9876500011',
      images: [PLACEHOLDER_IMAGES[1]],
    },
  ];

  const rooms = await Room.insertMany(roomsData);

  console.log('Creating a sample rental request...');
  await RentalRequest.create({
    room: rooms[0]._id,
    applicant: seeker._id,
    owner: rooms[0].owner,
    name: seeker.name,
    email: seeker.email,
    phone: seeker.phone,
    message: 'Hi, I am interested in this room. Is it still available?',
    preferredMoveInDate: new Date('2026-09-10'),
    status: 'Pending',
  });

  console.log('\nSeed complete!');
  console.log('----------------------------------------');
  console.log('Demo Owner login:  owner@roomnest.com / Owner@123');
  console.log('Demo Owner 2 login: owner2@roomnest.com / Owner@123');
  console.log('Demo Seeker login: user@roomnest.com / User@123');
  console.log('----------------------------------------');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
