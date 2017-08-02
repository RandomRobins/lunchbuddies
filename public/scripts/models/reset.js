'use strict';

var app = app || {};

(function (module) {

  module.resetWTIA = function () {
    $.getJSON('data/wtia.json').then(
      function (data) {
        let members = data[0];
        let groups = data[1];
        let pastMatches = data[2];
        let recentMatch = data[3];
        members.forEach(function(person){
          $.post('/roster', {name :person}).then(app.rosterController())
        })
        $.post('/matches', {matches: recentMatch})
      })
  }

})(app);

//
// app.get('/reset', function(req, res) {
//   client.query(`
//     DROP TABLE roster;
//     DROP TABLE rounds;
//     DROP TABLE matches;
//     `)
//     .then(result => {res.send(result.rows)})
//     .catch(console.error);
// })
