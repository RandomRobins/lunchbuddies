'use strict';

var app = app || {};

(function (module) {

  function rosterController () {
    app.Member.loadRoster(app.initRosterView);
  }

  rosterController.addMember = function(e) {
    e.preventDefault();
    console.log(e);
    app.Member.addMember(app.rosterController);
  }





  module.rosterController = rosterController;
})(app);
