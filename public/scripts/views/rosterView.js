'use strict';

var app = app || {};

(function (module) {




  let initRosterView = function () {
    $('#roster-display').empty();
    $('#rosterPage').show().siblings().hide();
    $('#roster-display').empty();
    app.Member.all.forEach(function(member) {
      let rosterCompiler = Handlebars.compile($('#hb-RosterTemplate').html());
      let compiledRoster = rosterCompiler(member);
      $('#roster-display').append(compiledRoster);
    })
    $('#addMember').on('click', app.rosterController.addMember);
  }

  module.initRosterView = initRosterView
})(app);
