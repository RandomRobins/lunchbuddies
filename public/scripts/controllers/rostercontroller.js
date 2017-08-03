'use strict';

var app = app || {};

(function (module) {

  function rosterController () {
    app.initRosterView();
  }

  rosterController.addMember = function() {
    app.Member.addMember(app.rosterController);
  }





  module.rosterController = rosterController;
})(app);
