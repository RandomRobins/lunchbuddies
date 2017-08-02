'use strict';

var app = app || {};

(function (module) {
  let initSplashView = function () {
    $('#splashPage').show().siblings().hide();
  }

  module.initSplashView = initSplashView;
})(app);
