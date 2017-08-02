'use strict';

var app = app || {};
var groupsDictionary = {};
var matchDictionary = {};

(function (module) {

  module.allMatches = {}
  module.allGroups = {}

  module.memberActive = app.Member.all.filter(function(member){
    return(member.active);
  })

  module.memberActiveID = module.memberActive.map(function(member) {
    return(member.id);
  })

  module.memberActive.forEach(function(member) {
    let options = module.memberActiveID.slice(0)
    let exclude = []
    for (let key in groupsDictionary) {
      if groupsDictionary[key].includes(member.id) {
        exclude = exclude.concat(groupsDictionary[key])
      }
    }
    for (let key in groupsDictionary) {
      if matchDictionary[key].includes(member.id) {
        exclude = exclude.concat(matchDictionary[key])
      }
    }
    options = options.filter(function(partner) {
      return (!exclude.includes(partner));
    })
    member.options = options;
  })

  module.sortPriority = function(memberArray) {
    memberArray.sort(function(a, b) {
      return(app.Member.byID[a].options.length - app.Member.byID[b].options.length)
    })
    return(memberArray)
  }

})(app);
