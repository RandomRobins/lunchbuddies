'use strict';

var app = app || {};

(function (module) {
// matches format: {matches: [[3,4,1,2,9],[6,8]]}
  var insertMatches = function (matches) {
    $.post('/api.matches', matches)
  }

  module.matchHistory = {};
  module.groupHistory = {};

  function loadPreviousMatches (callback) {
    if (!app.Member.all.length) {
      app.Member.loadRoster(()=>{})
    }
    $.get('/api.checkmatches')
    .then(function(results) {
      let data = results.rows;
      data.forEach(function(match) {
        if (module.matchHistory[match.match_id]) {
          module.matchHistory[match.match_id].push(match.user_id)
        } else {
          module.matchHistory[match.match_id] = [(match.user_id)]
        }
      }
    )})
    .then(loadPreviousGroups(callback));
  }

  function loadPreviousGroups (callback) {
    $.get('/api.checkgroups')
    .then(function(results) {
      let data = results.rows;
      data.forEach(function(group) {
        if (module.groupHistory[group.group_id]) {
          module.groupHistory[group.group_id].push(group.user_id)
        } else {
          module.groupHistory[group.group_id] = [(group.user_id)]
        }
      }
    )})
    .then(callback);
  }

  function postMatches(callback) {
    if (app.latestMatch) {
      var matchToSave;
      if ($('#funkyfresh').text() == 'Showing All Matches') {
        matchToSave = app.latestMatch[0].concat(app.latestMatch[1])
      } else {
        matchToSave = app.latestMatch[0];
      }
      $.post('/api.matches', {matches: matchToSave})
      .then(function() {
        app.latestMatch = null;
        callback();
      })
    }
  }

  module.postMatches = postMatches;
  module.loadPreviousMatches = loadPreviousMatches;
  module.insertMatches = insertMatches;
})(app);
