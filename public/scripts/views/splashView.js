'use strict';

var app = app || {};

(function (module) {
  let initSplashView = function () {
    $('.main-nav').hide();
    $('#splashPage').show().siblings().hide();
  }

  module.initSplashView = initSplashView;
})(app);
