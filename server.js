'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const PORT = process.env.PORT || 3000;
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

// app.get('/*', (req, res) => res.sendFile('index.html', {root: './public'}));

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
      user_id int
    );`
  );
  client.query(`
    CREATE TABLE IF NOT EXISTS subgroups (
      group_id int,
      user_id int
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

app.post('/checkname', function(req, res) {
  console.log('checking for: ', req.body.name);
  client.query(`
    SELECT * FROM roster WHERE name='${req.body.name}';
    `)
    .then(result => {res.send(result.rows)})
    .catch(console.error);
})


app.post('/roster', function(req, res) {
  console.log('attempting: ', req.body.name);
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

app.post('/subgroups', function(req, res) {
  client.query(`
    INSERT INTO subgroups(user_id, group_id)
    VALUES ($1, $2);
    `,[req.body.user, req.body.group],
  function (e) {
    if (e) {
      // console.error(e);
    } else {
      res.send('insert complete');
    }
  })
})

app.get('/checkgroups', function(req, res) {
  client.query(`
    SELECT user_id, group_id FROM subgroups;
    `)
    .then(result => {
      res.send(result)
    })
    .catch(console.error);
})


// for test purposes only

app.get('/reset', function(req, res) {
  client.query(`
    DROP TABLE roster;
    DROP TABLE matches;
    DROP TABLE rounds;
    DROP TABLE subgroups;
    `)
    .then(loadDB())
    .then(result => res.send(result));
})

app.get('/checkrecord/*', function(req, res) {
  // when a user ID is entered as a params URL, return a list of users who are either in the same department, or who have been matched up with the user before
  client.query(`
    SELECT user_id FROM matches WHERE match_id in
    (SELECT match_id FROM matches WHERE user_id=${req.params[0]}) or user_id in
    (SELECT user_id FROM subgroups WHERE group_id=
      (SELECT group_id FROM subgroups WHERE user_id=${req.params[0]}));
    `)
    .then(result => {
      res.send(result)
    })
    .catch(console.error);
})

app.post('/matches', function(req, res) {
  client.query(`
    SELECT max(round) as round, max(match_id) as match FROM rounds;
    `).then(results => {
      let round = results.rows[0].round || 0;
      let match = results.rows[0].match || 0;
      round++;
      match++;
      insertMatches(round, match, req.body.matches);
    }).then(result => res.send(result))
})

app.get('/checkmatches', function(req, res) {
  client.query(`
    SELECT match_id, user_id FROM matches;
    `)
    .then(result => {
      res.send(result)
    })
    .catch(console.error);
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
    for (let p=0; p < matches[i].length; p++) {
      let currentMatch = maxMatch + i
      let person = matches[i][p]
      client.query(`
        INSERT INTO matches(match_id, user_id)
        VALUES ('${currentMatch}', '${person}');
        `,
      function (e) {
        if (e) {
          console.error('e');
        } else {
          // res.send('insert complete');
        }
      })
    }
  }
}
