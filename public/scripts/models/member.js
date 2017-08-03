'use strict';

var app = app || {};

(function (module) {

  function Member (rawDataObj) {
    this.name = rawDataObj.name;
    this.id = rawDataObj.id;
    this.active = true;
    this.status = 'active';
    Member.byID[rawDataObj.id] = (this);
    Member.idList.push(this.id);
    this.exclusion = [];
    this.options = [];
  }

  Member.all = [];
  // access Member objects by ID number
  Member.byID = []
  // all IDs of all members
  Member.idList = []

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
    $.post('/checkname', {name :$('#name').val()})
    .then(function(results) {
      if (!results.length) {
        $.post('/roster', {name :$('#name').val()}).then(
          function() {
            if (Member.all.length) {
              let currentID = Member.all[Member.all.length - 1].id + 1;
              Member.all.push(new Member({name: ('#name').val(), id: currentID}))
            }
            callback();
          }
        )
      } else {
        alert('Name already in system.');
      }
    }
    )
  }

  module.Member = Member;
})(app);
