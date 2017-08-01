'use strict';

var app = app || {};

(function (module) {

  function Member (rawDataObj) {
    this.name = rawDataObj.name;
    this.id = rawDataObj.id;
    this.active = true;
  }

  Member.all = [];

  Member.loadRoster = function () {
    $.get('/roster')
    .then(
      results => {
        Member.all = results.map(ele => new Member(ele));
      }
    )
  }

  Member.addMember = function() {


  }

  module.Member = Member;
})(app);
