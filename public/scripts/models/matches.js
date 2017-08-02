'use strict';

var app = app || {};

(function (module) {

  var insertMatches = function () {
    $.post('/matches', {matches: [[3,4,1,2,9],[6,8]]})
  }

  module.insertMatches = insertMatches;
} )(app);
