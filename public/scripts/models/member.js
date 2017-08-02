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

  Member.previous = function () {
    $.get('/checkrecord/' + 3)
    .then(
      results => {
        console.log(results)
      }
    )
  }

  module.Member = Member;
})(app);
