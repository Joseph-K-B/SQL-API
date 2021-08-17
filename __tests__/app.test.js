/* eslint-disable no-console */
require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const chordData = require('../data/chords.js');
// const exp = require('constants');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      // const signInData = await fakeRequest(app)
      //   .post('/auth/signup')
      //   .send({
      //     email: 'jon@user.com',
      //     password: '1234'
      //   });
      
      // token = signInData.body.token; // eslint-disable-line
    }, 1000000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns chords', async() => {

      const expectation = chordData.map(chord => chord.chord);
      const expectedObject =
        {
          id:1,
          key: 'c-major',
          chord: 'C-major',
          major: true,
          class_id: 1,
          class: 'primary'
        };
      

      const data = await fakeRequest(app)
        .get('/chords')
        .expect('Content-Type', /json/)
        .expect(200);
      const chords = data.body.map(chord => chord.chord);
      expect(chords).toEqual(expectation);
      expect(chords.length).toBe(chordData.length);
      expect(data.body[0]).toEqual(expectedObject);
    }, 100000);

    test('GET /chords/:id returns the individual chord', async ()=>{
      const expectation = chordData[0];
      expectation.id = 1;
      
      const data = await fakeRequest(app)
        .get('/chords/1')
        .expect('Content-Type', /json/)
        .expect(200);
      console.log(data.body);
      
      expect(data.body).toEqual(expectation);
    });

    test('POST /chords creates new chord', async ()=>{
      const newChord = {
        key: 'c#-major',
        chord: 'c#-major',
        major: true,
        class_id: 1
      };

      const data = await fakeRequest(app)
        .post('/chords')
        .send(newChord)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(data.body.chord).toEqual(newChord.chord);
      expect(data.body.id).toBeGreaterThan(0);
    });

    test('PUT /chords/:id updates chords', async ()=>{
      const newData = {
        id:1,
        key: 'c-major',
        chord: 'C-major',
        major: true,
        class_id: 1
      };
      const data = await fakeRequest(app)
        .put('/chords/1')
        .send(newData)
        .expect(200)
        .expect('Content-Type', /json/);
        
      expect(data.body.key).toEqual(newData.key);
      expect(data.body.chord).toEqual(newData.chord);
      expect(data.body.major).toEqual(newData.major);
    });
  });
});
