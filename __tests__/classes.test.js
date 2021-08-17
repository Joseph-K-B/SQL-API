require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const classesData = require('../data/classes.js');

describe('system routes', () => {

  beforeAll(async () => {
    execSync('npm run setup-db');

    await client.connect();
    
  }, 20000);

  afterAll(done => {
    return client.end(done);
  });

  test('returns classes', async() => {

    const expectation = classesData.map(prim => prim.class);

    const data = await fakeRequest(app)
      .get('/classes')
      .expect('Content-Type', /json/)
      .expect(200);
    const classSort = data.body.map(prim => prim.class);
    expect(classSort).toEqual(expectation);
    expect(classSort.length).toBe(classSort.length);
    expect(data.body[0].id).toBeGreaterThan(0);
  });
});