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
    funkyFreshToggle();
    saveMatchToDatabase()
  }

  function funkyFreshToggle() {
    $('#funkyfresh').on('click', function() {
      let text = $('#funkyfresh').text()
      if (text == 'Showing All Matches') {
        $('#funkyfresh').text('New Connections Only')
        $('.funkypair').css('display','none');
      } else {
        $('#funkyfresh').text('Showing All Matches')
        $('.funkypair').css('display','block');
      }
    });
  }

  function saveMatchToDatabase() {
    $('#savematches').on('click', function() {
      if (app.latestMatch) {
        var matchToSave;
        if ($('#funkyfresh').text() == 'Showing All Matches') {
          matchToSave = app.latestMatch[0].concat(app.latestMatch[1])
        } else {
          matchToSave = app.latestMatch[0];
        }
        $.post('/api.checkname', {name :matchToSave})
        .then(function() {
          app.latestMatch = null;
        })}
    })
  }



  function displayMatches(matchesAll) {
    var matches = matchesAll[0].map(function(match) {
      match = match.map(function(personID) {
        return app.Member.byID[personID].name
      })
      return match.join(' && ')
    })
    $('#matchResults').empty()
    matches.forEach(function(match) {
      let li = $('<li></li>').attr('class', 'freshpair');
      li.text(match)
      $('#matchResults').append(li)
    })
    matches = matchesAll[1].map(function(match) {
      match = match.map(function(personID) {
        return app.Member.byID[personID].name
      })
      return match.join(' && ')
    })
    matches.forEach(function(match) {
      let li = $('<li></li>').attr('class', 'funkypair');
      li.text(match)
      $('#matchResults').append(li)
    })
  }

  module.displayMatches = displayMatches;
  module.initMatchesView = initMatchesView;
})(app);
