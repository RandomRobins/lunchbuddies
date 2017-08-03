'use strict';

var app = app || {};

(function (module) {
  let matchesController = function () {
    app.loadPreviousMatches(app.initMatchesView);
  }

  matchesController.getMatches = function () {
    app.displayMatches(app.Random.findPairs());
  }

  module.matchesController = matchesController;
})(app);
