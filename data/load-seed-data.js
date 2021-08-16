/* eslint-disable no-console */
const client = require('../lib/client');
// import our seed data:
const chordData = require('./chords.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      chordData.map(chord => {
        return client.query(`
                    INSERT INTO chords ( 
                      key, 
                      chord, 
                      major, 
                      class)
                    VALUES ($1, $2, $3, $4) 
                    RETURNING *;
                `,
        [ 
          chord.key, 
          chord.chord, 
          chord.major, 
          chord.class
        ]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
