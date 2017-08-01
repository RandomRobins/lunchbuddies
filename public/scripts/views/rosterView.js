'use strict';

var app = app || {};

(function (module) {




  let initRosterView = function () {
    $('#addMember').on('click', app.rosterController.addMember);
    $('#rosterPage').show().siblings().hide()
  }

  module.initRosterView = initRosterView
})(app);
