'use strict';

var app = app || {};

(function (module) {

  function Member (rawDataObj) {
    this.name = rawDataObj.name;
    this.id = rawDataObj.id;
    this.active = true;
  }

  Member.all = [];

  Member.loadRoster = function (callback) {
    $.get('/roster')
    .then(
      results => {
        Member.all = results.map(ele => new Member(ele));
        callback();
      }
    )
  }

  Member.addMember = function(callback) {
    $.post('/roster', {name :$('#name').val()}).then(
      callback()
    )
  }

  module.Member = Member;
})(app);
