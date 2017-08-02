'use strict';

var app = app || {};

(function (module) {
  let matchesController = function () {
    app.initMatchesView();
  }

  matchesController.getMatches = function () {
    app.Random.findPairs();
  }

  module.matchesController = matchesController;
})(app);
