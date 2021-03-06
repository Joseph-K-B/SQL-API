const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});
app.get('/classes', async(req, res) => {
  try {
    const data = await client.query('SELECT * FROM classes;'
    );
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/chords', async(req, res) => {
  try {
    const data = await client.query(`SELECT 
    chords.id,
    chords.musical_key, 
    chords.chord,
    chords.major,
    chords.class_id,
    classes.class AS class
    FROM chords INNER JOIN classes
    ON chords.class_id = classes.id
    ORDER BY chords.id;`
    );
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/chords/:id', async(req, res) =>{
  const id = req.params.id;
  try {
    const data = await client.query('SELECT * from chords WHERE id = $1', [id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/chords', async(req, res)=>{

  try{
    const data = await client.query(`
    INSERT INTO chords(
      musical_key, chord, major, class_id
    ) VALUES ($1, $2, $3, $4) RETURNING *;`, [ 
      req.body.musical_key, 
      req.body.chord, 
      req.body.major, 
      req.body.class_id
    ]);
    res.json(data.rows[0]);
  }catch(e){
    res.status(500).json({ error: e.message });
  }
});


app.put('/chords/:id', async(req, res)=>{
  try { 
    const data = await client.query(`
    UPDATE chords
    SET 
    musical_key=$2,
    chord=$3,
    major=$4,
    class_id=$5
    WHERE id = $1
    RETURNING *;
    `, [
      req.params.id, 
      req.body.musical_key, 
      req.body.chord, 
      req.body.major, 
      req.body.class_id
    ]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
app.use(require('./middleware/error'));

module.exports = app;
