/* eslint-disable no-console */
const client = require('../lib/client');
// import our seed data:
const chordData = require('./chords.js');
const classData = require('./classes.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {


  try {
    await client.connect();

    await Promise.all(
      classData.map(classes => {
        return client.query(`
            INSERT INTO classes (class)
            VALUES ($1)
            RETURNING *;
            `, 
        [classes.class]);
      })
    );

    await Promise.all(
      chordData.map(chord => {
        return client.query(`
                    INSERT INTO chords ( 
                      musical_key, 
                      chord, 
                      major, 
                      class_id)
                    VALUES ($1, $2, $3, $4) 
                    RETURNING *;
                `,
        [ 
          chord.musical_key, 
          chord.chord, 
          chord.major, 
          chord.class_id
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
