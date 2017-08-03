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
  }

  function displayMatches(matches) {
    let nameByIndex = app.Member.byID.map(function (ele) {
      return ele.name;
    })
    let matchByName = matches.map(match => match.map(i => nameByIndex[i]))
    $('#matchResults').empty().html(matchByName.join('<br>'));
  }

  module.displayMatches = displayMatches;
  module.initMatchesView = initMatchesView;
})(app);
