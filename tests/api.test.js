const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: false });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Health Check', () => {
  test('GET /health should return ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Members API', () => {
  test('GET /members should return paginated members', async () => {
    const res = await request(app).get('/members');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('data');
  });

  test('POST /members should create a member', async () => {
    const res = await request(app)
      .post('/members')
      .send({ name: 'Test User', email: `test${Date.now()}@example.com`, phone: '555-0000' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test User');
  });

  test('GET /members/:id should return a member', async () => {
    const res = await request(app).get('/members/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  test('GET /members/:id should return 404 for invalid id', async () => {
    const res = await request(app).get('/members/99999');
    expect(res.statusCode).toBe(404);
  });
});

describe('Books API', () => {
  test('GET /books should return paginated books', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('data');
  });

  test('GET /books/:id should return 404 for invalid id', async () => {
    const res = await request(app).get('/books/99999');
    expect(res.statusCode).toBe(404);
  });
});

describe('Loans API', () => {
  test('GET /loans/:id should return 404 for invalid id', async () => {
    const res = await request(app).get('/loans/99999');
    expect(res.statusCode).toBe(404);
  });
});