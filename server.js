'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

// const conString = 'postgres://localhost:5432/lunchbuddies'
const conString = process.env.conString || `postgres://postgres:${process.env.PG_PASSWORD}@localhost:5432/lunchbuddies`;
const client = new pg.Client(conString);
client.connect();
client.on('error', err => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));

app.listen(PORT, () => console.log(`app listening on port: ${PORT}`));

loadDB();

function loadDB () {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    roster (id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
    );`
  )
}

app.get('/roster', function(req, res) {
  client.query(`
    SELECT * FROM roster;
    `)
    .then(result => {res.send(result.rows); console.log(result.rows);})
    .catch(console.error);
})

app.post('/roster', function(req, res) {
  client.query(`
    INSERT INTO roster(name)
    VALUES ('${req.body.name}');
    `,
  function (e) {
    if (e) {
      console.error(e);
    } else {
      res.send('insert complete');
    }
  })
})
