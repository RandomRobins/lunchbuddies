'use strict';

var app = app || {};

(function (module) {
  function initAboutView() {
    $('#aboutPage').show().siblings().hide();
    $('#main-nav').show();
  }
  module.initAboutView = initAboutView;
})(app);
