const sort = function(list, comparator) {
  let sorted = false;
  while(sorted==false) {
    sorted = true;
    var temp = null;
    for(var i=0;i<list.length-1;i++) {
      var swap = comparator(list[i],list[i+1])==1;
      if(swap) {
          temp = list[i];
          list[i] = list[i+1];
          list[i+1] = temp;
          sorted = false;
      }
    }
  }
  return list;
}
exports.compareAllTime = function(reactionA, reactionB) {
  if(reactionA.total<reactionB.total) {
    return 1;
}
  return 0;
}

exports.compareWeekly = function(reactionA, reactionB) {
  if(reactionA.thisWeek<reactionB.thisWeek) {
    return 1;
  }
  return 0;
}

exports.compareChange = function(reactionA, reactionB) {
  if(((reactionA.thisWeek-reactionA.lastWeek)/reactionA.lastWeek)<((reactionB.thisWeek-reactionB.lastWeek)/reactionB.lastWeek)) {
    return 1;
  }
  return 0;
}

exports.sort =sort;
