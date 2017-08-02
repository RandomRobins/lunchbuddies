'use strict';

var app = app || {};

(function (module) {

  var insertMatches = function () {
    $.post('/matches', {matches: [[3,4,1,2,9],[6,8]]})
  }

  module.generateMatches = function() {
    let memberList = Member.all.slice(0);
    let matchList = []
    let seenEveryone = [];
    // for member in memberList:
    //   options list = list of all member IDs, with restricted entires filtered out
    //   Members with 0 options are moved to the seenEveryone list, and will therefore go localhost
    //   if there are an odd number of members, then the person with the fewest possible options will also be set aside
    // With the list remaining, sort by priority
    // Now we loop through the list, starting with the people with the fewest options
    // If there's an odd number of people, skip the first person
    //   Go through the persons options, and randomly pick an ID
    //   Both parters added to the Match list
    //   For each user:
    //     Check everyone on the users option list
    //     Each person on that list has a list of their own.  Remove the user.
    // After everyone has been checked, do another round of sorting
    // Repeat until there are no available users left
    // People with zero options left can be randomized amongst themselves.
    // Finally, insert matches
  }

  module.sortByPriority = function(array) {
    array.sort(function(a, b) {
      // sort by who has the smallest list of options
    })
  }

  module.insertMatches = insertMatches;
} )(app);
