'use strict';

var app = app || {};

(function (module) {
  function initMatchesView () {
    $('.page').hide();
    $('#matchesPage').show();
    $('.main-nav').show();
    $('#rosterSelection').empty()
    app.Member.all.map(function(member) {
      let rosterCompiler = Handlebars.compile($('#hb-RosterSelectionTemplate').html());
      let compiledRoster = rosterCompiler(member);
      $('#rosterSelection').append(compiledRoster);
    })
    $('#getMatches').on('click', app.matchesController.getMatches);
    app.rosterChangeActivation();
  }

  function displayMatches(matches) {
    matches = matches.map(function(match) {
      match = match.map(function(personID) {
        return app.Member.byID[personID].name
      })
      return match.join(' && ')
    })
    $('#freshMatchResults').empty()
    matches.forEach(function(match) {
      let li = $('<li></li>').attr('class', 'freshpair');
      li.text(match)
      $('#freshMatchResults').append(li)
    })
  }

  module.displayMatches = displayMatches;
  module.initMatchesView = initMatchesView;
})(app);
