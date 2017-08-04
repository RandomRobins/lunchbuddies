'use strict';

var app = app || {};

(function (module) {
  function rosterChangeActivation() {
    $('.roster').on('click', function() {
      let thisID = parseInt($(this).attr('id').split('-')[2]);
      if ($(this).attr('class') == 'roster match-active') {
        app.Member.byID[thisID].status = 'inactive';
        app.Member.byID[thisID].active = false;
        $(this).attr('class', 'roster match-inactive');
        $(this).attr('class', 'roster match-inactive');
      } else if ($(this).attr('class') == 'roster match-inactive') {
        app.Member.byID[thisID].status = 'active';
        app.Member.byID[thisID].active = true;
        $(this).attr('class', 'roster match-active');
      }
    });
  }

  $(document).ready(function() {
    rosterChangeActivation();
  });
  module.rosterChangeActivation = rosterChangeActivation;
})(app);
