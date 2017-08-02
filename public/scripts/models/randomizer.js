'use strict';

var app = app || { '1': [ 1, 5, 13, 18 ],
  '2': [ 2, 6, 19, 22, 26, 30 ],
  '3': [ 3, 4, 24, 25, 32 ],
  '4': [ 9, 17, 21 ],
  '5': [ 7, 10, 12, 14, 20, 29 ],
  '6': [ 16, 23, 27, 28 ],
  '7': [ 11, 15, 31 ] };

var groupsDictionary = {};
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

  Random.memberActive = function() {
    return(app.Member.all.filter(function(member){
      return(member.active);
    }))
  }

  Random.memberActiveID = function(memberArray) {
    return(memberArray.map(function(member) {
      return(member.id);
    }))
  }

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
      member.options = options;
    })
  }

  Random.sortPriority = function(tempArray) {
    tempArray.sort(function(a, b) {
      return(app.Member.byID[a].options.length - app.Member.byID[b].options.length)
    })
    return(tempArray)
  }

  Random.noOptions = function(tempArray) {
    return tempArray.filter(function(member) {
      return !member.options.length;
    })
  }

  Random.someOptions = function(tempArray) {
    return tempArray.filter(function(member) {
      return member.options.length;
    })
  }

  Random.findPairs = function (memberArray) {
    var activeMembers = Random.memberActive();
    var memberIDs = Random.memberActiveID(activeMembers);
    Random.insertOptionsn(memberIDs, activeMembers);
    var trio = [];
    var seenEveryone = [];
    var partnered = []
    seenEveryone = seenEveryone.concat(Random.noOptions(memberIDs))
    if (seenEveryone.length) {
      memberIDs = Random.someOptions(memberIDs)
    }
    var tempMatches = [];
    while (memberIDs.length >= 2) {
      seenEveryone.concat(Random.noOptions(memberIDs))
      memberIDs = Random.someOptions(memberIDs)
      if (memberIDs.length >= 2) {
        var sortedIDs = Random.sortPriority(memberIDs);
        var first = sortedIDs[0];
        var firstOptions = app.Member.byID[first].options;
        let r = Math.floor(Math.random() * firstOptions.length);
        var second = firstOptions[r];
        var secondOptions = app.Member.byID[second].options;
        firstOptions.forEach(function(nonpartnerID) {
          let nonpartner = app.Member.byID[nonpartnerID];
          nonpartner.options.splice(nonpartner.options.indexOf(first), 1)
        })
        secondOptions.forEach(function(nonpartnerID) {
          let nonpartner = app.Member.byID[nonpartnerID];
          nonpartner.options.splice(nonpartner.options.indexOf(first), 1)
        })
        tempMatches.push([first, second]);
        memberIDs.splice(memberIDs.options.indexOf(first), 1);
        memberIDs.splice(memberIDs.options.indexOf(second), 1);
      } else if (memberIDs.length == 1) {
        if (seenEveryone.length % 2) {
          seenEveryone.concat(memberIDs);
        } else {
          trio.push(memberIDs[0]);
        }
        memberIDs = [];
      }
    }
    if (!seenEveryone.length % 2) {
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
    if (trio.length) {
      let r = Math.floor(Math.random() * tempMatches.length);
      tempMatches[r].push(trio[0])
    }
    return(tempMatches)
  }
})(app);
