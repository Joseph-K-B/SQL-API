require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 1000000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns chords', async() => {

      const expectation = [
        {
          id:1,
          key: 'c-major',
          chord: 'C-major',
          major: true,
          class: 'primary'
        },
        {
          id:2,
          key: 'c-major',
          chord: 'D-minor',
          major: false,
          class: 'primary'
        },
        {
          id:3,
          key: 'c-major',
          chord: 'E-minor',
          major: false,
          class: 'primary'
        },
        {
          id:4,
          key: 'c-major',
          chord: 'F-major',
          major: true,
          class: 'primary'
        },
        {
          id:5,
          key: 'c-major',
          chord: 'G-major',
          major: true,
          class: 'primary'
        },
        {
          id:6,
          key: 'c-major',
          chord: 'A-minor',
          major: false,
          class: 'primary'
        },
        {
          id:7,
          key: 'c-major',
          chord: 'C-major7',
          major: true,
          class: 'secondary'
        },
        {
          id:8,
          key: 'c-major',
          chord: 'D-minor7',
          major: false,
          class: 'secondary'
        },
        {
          id:9,
          key: 'c-major',
          chord: 'E-minor7',
          major: false,
          class: 'secondary'
        },
        {
          id:10,
          key: 'c-major',
          chord: 'F-major7',
          major: true,
          class: 'secondary'
        },
        {
          id:11,
          key: 'c-major',
          chord: 'G-dominant7',
          major: false,
          class: 'secondary'
        },
        {
          id:12,
          key: 'c-major',
          chord: 'A-minor7',
          major: false,
          class: 'secondary'
        },
      ];

      const data = await fakeRequest(app)
        .get('/chords')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
