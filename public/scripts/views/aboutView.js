'use strict';

var app = app || {};

(function (module) {
  function initAboutView() {
    $('#aboutPage').show().siblings().hide();
  }
  module.initAboutView = initAboutView;
})(app);
