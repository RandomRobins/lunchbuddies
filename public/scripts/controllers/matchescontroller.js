'use strict';

var app = app || {};

(function (module) {
  let matchesController = function () {
    app.initMatchesView();
  }

  module.matchesController = matchesController;
})(app);
