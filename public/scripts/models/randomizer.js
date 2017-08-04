'use strict';

var app = app || {};

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
      for (let key in app.groupHistory) {
        if (app.groupHistory[key].includes(member.id)) {
          exclude = exclude.concat(app.groupHistory[key])
        }
      }
      for (let key in app.matchHistory) {
        if (app.matchHistory[key].includes(member.id)) {
          exclude = exclude.concat(app.matchHistory[key])
        }
      }
      let tempExclude = [];
      exclude.forEach(function(ex) {
        if (!tempExclude.includes(ex)) {
          tempExclude.push(ex);
        }
      })
      options = options.filter(function(partner) {
        return (!tempExclude.includes(partner));
      })
      member.exclusion = tempExclude;
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
      if (memberIDs.length == 1) {
        trio = [memberIDs[0]];
        memberIDs = [];
      }
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
      }
    }
    var extraMatches = [];
    let tempSeenEveryone = [];
    seenEveryone.forEach(function(ex) {
      if (!tempSeenEveryone.includes(ex)) {
        tempSeenEveryone.push(ex);
      }
    })
    seenEveryone = tempSeenEveryone.slice(0);
    if (trio[length] && seenEveryone.length % 2) {
      seenEveryone.push(trio[0]);
      trio = [];
    }
    if (seenEveryone.length % 2) {
      let r = Math.floor(Math.random() * seenEveryone.length);
      trio.push(seenEveryone[r]);
      seenEveryone.splice(r, 1);
    }
    while (seenEveryone.length >= 2) {
      let r = Math.floor(Math.random() * (seenEveryone.length - 1)) + 1
      extraMatches.push([seenEveryone[0], seenEveryone[r]]);
      seenEveryone.splice(0, 1);
      seenEveryone.splice(r, 1);
    }
    // add the odd person out to a random group
    if (trio.length) {
      let triperson = trio[0];
      let triexclude = Random.byID[triperson].exclusion;
      var possibleNew = tempMatches.filter(function(partnership) {
        return (triexclude.includes(partnership[0]) || triexclude.includes(partnership[1]) )
      })
      if (possibleNew.length) {
        let r = Math.floor(Math.random() * possibleNew.length);
        let ri = tempMatches.indexOf(possibleNew[r])
        tempMatches[ri].push(triperson)
      } else if (extraMatches.length) {
        let r = Math.floor(Math.random() * extraMatches.length);
        extraMatches[r].push(triperson)
      } else {
        let r = Math.floor(Math.random() * tempMatches.length);
        tempMatches[r].push(triperson)
      }
    }
    return([tempMatches, extraMatches])
  }
  module.Random = Random;
})(app);
