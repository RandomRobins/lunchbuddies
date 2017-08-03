'use strict';

var app = app || {}

function rosterChangeActivation() {
  $('.roster').on('click', function() {
    let thisID = parseInt($(this).attr('id').split('-')[1]);
    if ($(this).attr('class') == 'roster active') {
      // alert(thisID)
      // alert(app.Member.all.length)
      app.Member.byID[thisID].status = 'inactive';
      app.Member.byID[thisID].active = false;
      // alert(app.Member.all[thisID])
      $(this).attr('class', 'roster inactive');
    } else {
      app.Member.byID[thisID].status = 'active';
      app.Member.byID[thisID].active = true;
      $(this).attr('class', 'roster active');
    }
  });
}


$(document).ready(function() {
  // alert('test');
  rosterChangeActivation();
});