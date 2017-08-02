'use strict';

var app = app || {};

(function (module) {

  function Member (rawDataObj) {
    this.name = rawDataObj.name;
    this.id = rawDataObj.id;
    this.active = true;
    Member.byID[rawDataObj.id] = (this);
    Member.priorityOrder.push(this.id);
    this.exclusion = [];
    $.get('/checkrecord/' + this.id)
    .then(
      results => {
        // Member.byID[id] = [results];
        this.exclusion = results.rows.map(function(element){
          return(element.user_id);
        })
      }
    )
  }

  Member.all = [];
  // access Member objects by ID number
  Member.byID = []
  // indexes of objects by order of who has the fewest choices first
  Member.priorityOrder = []

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
