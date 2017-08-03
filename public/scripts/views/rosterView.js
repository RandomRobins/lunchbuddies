'use strict';

var app = app || {};

(function (module) {




  let initRosterView = function () {
    $('#roster-display').empty();
    $('.page').hide();
    $('#rosterPage').show();

    $('.main-nav').show();
    app.Member.all.map(function(member) {
      let rosterCompiler = Handlebars.compile($('#hb-RosterTemplate').html());
      let compiledRoster = rosterCompiler(member);
      $('#roster-display').append(compiledRoster);
    })
    $('#addMember').on('click', app.rosterController.addMember);
    rosterChangeActivation();
  }

  module.initRosterView = initRosterView
})(app);
