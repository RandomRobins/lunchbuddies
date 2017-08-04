'use strict';

var app = app || {};

(function (module) {

  function rosterController () {
    app.Member.loadRoster(app.initRosterView);
  }

  rosterController.addMember = function(e) {
    e.preventDefault();
    app.Member.addMember(app.rosterController);
  }

  module.rosterController = rosterController;
})(app);
