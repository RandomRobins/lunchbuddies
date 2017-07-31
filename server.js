'use strict';

const express = require('express');
const pg = require('pg');

const PORT = process.env.PORT || 3000;
const app = express();

const conString = 'postgres://localhost:5432/lunchbuddies'
// const conString = process.env.conString || `postgres://postgres:${process.env.PG_PASSWORD}@localhost:5432/lunchbuddies`;
const client = new pg.Client(conString);
client.connect();
client.on('error', err => console.error(err));

app.use(express.static('./public'));

app.listen(PORT, () => console.log(`app listening on port: ${PORT}`));
