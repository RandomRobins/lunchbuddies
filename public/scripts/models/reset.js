'use strict';

var app = app || {};

(function (module) {

  module.addGroup = function(user_id, group_id) {
    $.post('/api.subgroups', {user:user_id, group:group_id}).then()
  }

  module.resetWTIA = function () {
    $.get('/api.reset').then(
      $.getJSON('data/wtia.json').then(
        function (data) {
          let members = data[0];
          let groups = data[1];
          let recentMatch = data[2];
          let allMatches = recentMatch.reduce(function(a, b) {
            return a.concat(b);
          }, []);
          members.forEach(function(person){
            $.post('/api.roster', {name :person}).then(app.rosterController())
          })
          groups.forEach(function(membership){
            $.post('/api.subgroups', {user:membership[0], group:membership[1]}).then()
          })
          $.post('/api.matches', {matches: allMatches})
        })
    )
  }


})(app);
