'use strict';

var app = app || {};

(function (module) {

  module.addGroup = function(user_id, group_id) {
    $.post('/subgroups', {user:user_id, group:group_id}).then()
  }

  module.resetWTIA = function () {
    $.get('/reset').then(
      $.getJSON('data/wtia.json').then(
        function (data) {
          let members = data[0];
          let groups = data[1];
          let recentMatch = data[2];
          members.forEach(function(person){
            $.post('/roster', {name :person}).then(app.rosterController())
          })
          groups.forEach(function(membership){
            $.post('/subgroups', {user:membership[0], group:membership[1]}).then()
          })
          $.post('/matches', {matches: recentMatch})
        })
    )
  }


})(app);
