process.env.JWT_SECRET = 'test_secret';
const request = require('supertest');
const app = require('../app');
const { setupTestDB, teardownTestDB } = require('./setup');

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

let ownerToken;
let seekerToken;
let roomId;

const owner = {
  name: 'Owner Test',
  email: 'owner@test.com',
  password: 'password123',
  role: 'owner',
};

const seeker = {
  name: 'Seeker Test',
  email: 'seeker2@test.com',
  password: 'password123',
  role: 'seeker',
};

const newRoom = {
  title: 'Test Room',
  description: 'A room for testing',
  rent: 8000,
  location: 'Gachibowli',
  roomType: 'Single Room',
  availableFrom: '2026-09-01',
  contactNumber: '9999999999',
};

beforeAll(async () => {
  const ownerRes = await request(app).post('/api/auth/register').send(owner);
  ownerToken = ownerRes.body.token;

  const seekerRes = await request(app).post('/api/auth/register').send(seeker);
  seekerToken = seekerRes.body.token;
});

describe('Room API', () => {
  test('owner can create a room', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${ownerToken}`)
      .field('title', newRoom.title)
      .field('description', newRoom.description)
      .field('rent', newRoom.rent)
      .field('location', newRoom.location)
      .field('roomType', newRoom.roomType)
      .field('availableFrom', newRoom.availableFrom)
      .field('contactNumber', newRoom.contactNumber);

    expect(res.statusCode).toBe(201);
    expect(res.body.room.title).toBe(newRoom.title);
    roomId = res.body.room._id;
  });

  test('seeker cannot create a room', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${seekerToken}`)
      .field('title', newRoom.title)
      .field('description', newRoom.description)
      .field('rent', newRoom.rent)
      .field('location', newRoom.location)
      .field('roomType', newRoom.roomType)
      .field('availableFrom', newRoom.availableFrom)
      .field('contactNumber', newRoom.contactNumber);

    expect(res.statusCode).toBe(403);
  });

  test('anyone can list rooms', async () => {
    const res = await request(app).get('/api/rooms');
    expect(res.statusCode).toBe(200);
    expect(res.body.rooms.length).toBeGreaterThan(0);
  });

  test('seeker can submit a rental request', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        roomId,
        name: seeker.name,
        email: seeker.email,
        phone: '8888888888',
        message: 'Interested!',
        preferredMoveInDate: '2026-09-15',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.request.status).toBe('Pending');
  });
});
