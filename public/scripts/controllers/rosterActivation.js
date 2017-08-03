'use strict';

var app = app || {};

(function (module) {
  function rosterChangeActivation() {
    $('.roster').on('click', function() {
      let thisID = parseInt($(this).attr('id').split('-')[2]);
      console.log(9, thisID);
      if ($(this).attr('class') == 'roster match-active') {
        // alert(thisID)
        // alert(app.Member.all.length)
        app.Member.byID[thisID].status = 'inactive';
        app.Member.byID[thisID].active = false;
        // alert(app.Member.all[thisID])
        $(this).attr('class', 'roster match-inactive');
      } else if ($(this).attr('class') == 'roster match-isactive') {
        app.Member.byID[thisID].status = 'active';
        app.Member.byID[thisID].active = true;
        $(this).attr('class', 'roster match-active');
      }
    });
  }

  $(document).ready(function() {
    // alert('test');
    rosterChangeActivation();
  });
  module.rosterChangeActivation = rosterChangeActivation;
})(app);
