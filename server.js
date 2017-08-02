'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const PORT = process.env.PORT || 3000;
const app = express();

const conString = 'postgres://localhost:5432/lunchbuddies'
// const conString = process.env.conString || `postgres://postgres:${process.env.PG_PASSWORD}@localhost:5432/lunchbuddies`;
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
    CREATE TABLE IF NOT EXISTS roster (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );`
  );
  client.query(`
    CREATE TABLE IF NOT EXISTS rounds (
      match_id SERIAL PRIMARY KEY,
      round int
    );`
  );
  client.query(`
    CREATE TABLE IF NOT EXISTS matches (
      match_id int,
      id int
    );`
  );
}

app.get('/roster', function(req, res) {
  client.query(`
    SELECT * FROM roster;
    `)
    .then(result => {res.send(result.rows)})
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


// app.post('/matches', function(req, res) {
//
  // client.query(`
  //   SELECT max(round) FROM rounds;
  //   `)
  //   .then(previousRound => {
  //     previousRound.rows[0].max;
  //   })
// })

app.post('/matches', function(req, res) {
  console.log('test')
  console.log(req.body.matches);
  client.query(`
    SELECT max(round) as round, max(match_id) as match FROM rounds;
    `).then(results => {
      let round = results.rows[0].round || 0;
      let match = results.rows[0].match || -1;
      round++;
      match++;
      insertMatches(round, match, req.body.matches);
    })
})

function insertMatches(maxRound, maxMatch, matches) {
  for (var i=0; i < matches.length; i++) {
    client.query(`
      INSERT INTO rounds(round)
      VALUES ('${maxRound}');
      `,
    function (e) {
      if (e) {
        console.error(e);
      } else {
        // res.send('insert complete');
      }
    })
    for (var p=0; p < matches[i].length; p++) {
      let currentMatch = maxMatch + i
      let person = matches[i][p]
      client.query(`
        INSERT INTO matches(match_id, id)
        VALUES ('${currentMatch}', '${person}');
        `,
      function (e) {
        if (e) {
          console.error(e);
        } else {
          // res.send('insert complete');
        }
      })
    }
  }
}


// app.post('/matches', function(req, res) {
//   console.log(typeof(req.body.matches));
//   [1,2].map(() => {
//     let currentRound = client.query(`
//         SELECT max(round) FROM rounds;
//       `)
//       .then()
//     console.log('current round: ' + currentRound);
//     client.query(`
//       INSERT INTO rounds (round)
//       VALUES (${currentRound})
//       `,
//     function (e) {
//       if (e) {
//         console.error(e);
//       } else {
//         res.send('insert complete');
//       }
//     })
//   })
//   console.log(84);
// })
