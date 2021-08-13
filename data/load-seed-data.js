const client = require('../lib/client');
// import our seed data:
const chords = require('./chords.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    await Promise.all(
      chords.map(chord => {
        return client.query(`
                    INSERT INTO chords (id, key, chord, major, class)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *;
                `,
        [chord.id, chord.key, chord.chord, chord.major, chord.class]);
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
