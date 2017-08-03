'use strict';

var app = app || {};

(function (module) {
  let matchesController = function () {
    app.loadPreviousMatches(app.initMatchesView);
  }

  matchesController.getMatches = function () {
    app.latestMatch = app.Random.findPairs()
    app.displayMatches(app.latestMatch);
  }

  matchesController.postMatches = function (e) {
    e.preventDefault();
    app.postMatches(app.matchesController);
  }

  module.matchesController = matchesController;
})(app);
