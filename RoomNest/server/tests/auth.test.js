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

describe('Auth API', () => {
  const seeker = {
    name: 'Test Seeker',
    email: 'seeker@test.com',
    password: 'password123',
    role: 'seeker',
  };

  test('registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(seeker);
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(seeker.email);
    expect(res.body.user.password).toBeUndefined();
  });

  test('rejects duplicate registration', async () => {
    const res = await request(app).post('/api/auth/register').send(seeker);
    expect(res.statusCode).toBe(400);
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: seeker.email, password: seeker.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('rejects login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: seeker.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });
});
