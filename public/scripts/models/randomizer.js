'use strict';

var app = app || {};

var groupsDictionary = { '1': [ 1, 5, 13, 18 ],
  '2': [ 2, 6, 19, 22, 26, 30 ],
  '3': [ 3, 4, 24, 25, 32 ],
  '4': [ 9, 17, 21 ],
  '5': [ 7, 10, 12, 14, 20, 29 ],
  '6': [ 16, 23, 27, 28 ],
  '7': [ 11, 15, 31 ] };
var matchDictionary = { '0': [ 13, 20 ],
  '1': [ 19, 12 ],
  '2': [ 7, 1 ],
  '3': [ 22, 17 ],
  '4': [ 21, 29 ],
  '5': [ 28, 3 ],
  '6': [ 15, 32 ],
  '7': [ 6, 24 ],
  '8': [ 16, 5 ],
  '9': [ 4, 30 ],
  '10': [ 10, 31 ],
  '11': [ 2, 18 ],
  '12': [ 8, 23 ],
  '13': [ 25, 26 ],
  '14': [ 14, 11 ],
  '15': [ 27, 9 ] };

(function (module) {

  var Random = {};

  Random.allMatches = {}
  Random.allGroups = {}
  Random.byID = {}

// generate a list of members who are active
  Random.memberActive = function() {
    return(app.Member.all.filter(function(member){
      return(member.active);
    }))
  }

// generate list of ids from members list
  Random.memberActiveID = function(memberArray) {
    return(memberArray.map(function(member) {
      return(member.id);
    }))
  }

// edit key values in dictory so that members can be accessed by id
  Random.setByID = function(ids, members) {
    members.forEach(function(member) {
      Random.byID[member.id] = member;
    })
  }

// checks options for each user
  Random.insertOptions = function(idlist, memberlist) {
    memberlist.forEach(function(member) {
      var options = idlist.slice(0)
      var exclude = []
      for (let key in groupsDictionary) {
        if (groupsDictionary[key].includes(member.id)) {
          exclude = exclude.concat(groupsDictionary[key])
        }
      }
      for (let key in matchDictionary) {
        if (matchDictionary[key].includes(member.id)) {
          exclude = exclude.concat(matchDictionary[key])
        }
      }
      options = options.filter(function(partner) {
        return (!exclude.includes(partner));
      })
      member.exclusion = exclude;
      member.options = options;
    })
  }

// maps an array where members are sorted by the number of options they have. the ones with the fewest options go first.
  Random.sortPriority = function(tempArray) {
    tempArray.sort(function(a, b) {
      return(Random.byID[a].options.length - Random.byID[b].options.length)
    })
    return(tempArray)
  }

// takes a list of indexes and returns the people with no options
  Random.noOptions = function(tempArray) {
    return tempArray.filter(function(id) {
      return !Random.byID[id].options.length;
    })
  }

// takes a list of indexes and returns the people with at least one option
  Random.someOptions = function(tempArray) {
    return tempArray.filter(function(id) {
      return Random.byID[id].options.length;
    })
  }

// generate pairs by calling all the functions created above
  Random.findPairs = function () {
    var activeMembers = Random.memberActive();
    var memberIDs = Random.memberActiveID(activeMembers);
    Random.insertOptions(memberIDs, activeMembers);
    var trio = [];
    var seenEveryone = [];
    app.Random.setByID(memberIDs, activeMembers)
    // people with no options left will go last
    seenEveryone = seenEveryone.concat(Random.noOptions(memberIDs))
    if (seenEveryone.length) {
      memberIDs = Random.someOptions(memberIDs)
    }
    var tempMatches = [];
    while (memberIDs.length > 0) {
      // check again to see if anyone lacks options
      seenEveryone = seenEveryone.concat(Random.noOptions(memberIDs))
      memberIDs = Random.someOptions(memberIDs)
      if (memberIDs.length >= 2) {
        // resort the list
        var sortedIDs = Random.sortPriority(memberIDs);
        // the first person in the sorted list will have the fewest options
        var first = sortedIDs[0];
        var firstOptions = Random.byID[first].options;
        // randomly pick a valid partner for the first person
        let r = Math.floor(Math.random() * firstOptions.length);
        var second = firstOptions[r];
        var secondOptions = Random.byID[second].options;
        // remove the first and second person from every option list they are in
        firstOptions.forEach(function(nonpartnerID) {
          let nonpartner = Random.byID[nonpartnerID];
          nonpartner.options.splice(nonpartner.options.indexOf(first), 1)
        })
        secondOptions.forEach(function(nonpartnerID) {
          let nonpartner = Random.byID[nonpartnerID];
          nonpartner.options.splice(nonpartner.options.indexOf(second), 1)
        })
        // add the match to the list and remove them from the index
        tempMatches.push([first, second]);
        memberIDs.splice(memberIDs.indexOf(first), 1);
        memberIDs.splice(memberIDs.indexOf(second), 1)
        // if there's one person left..
      } else {
        // if the seenEveryone list is odd, just add the last member to that list
        if (seenEveryone.length % 2) {
          seenEveryone.concat(memberIDs);
        } else {
          // if there is an odd number of people, prepare for one group of three
          trio.push(memberIDs[0]);
        }
        memberIDs = [];
      }
    }
    if (seenEveryone.length % 2) {
      let r = Math.floor(Math.random() * seenEveryone.length);
      trio.push(seenEveryone[r]);
      seenEveryone.splice(r, 1);
    }
    while (seenEveryone.length >= 2) {
      let r = Math.floor(Math.random() * (seenEveryone.length - 1)) + 1
      tempMatches.push(seenEveryone[0], seenEveryone[r]);
      seenEveryone.splice(0, 1);
      seenEveryone.splice(r, 1);
    }
    // add the odd person out to a random group
    if (trio.length ) {
      let r = Math.floor(Math.random() * tempMatches.length);
      tempMatches[r].push(trio[0])
    }
    return(tempMatches)
  }
  module.Random = Random;
})(app);
