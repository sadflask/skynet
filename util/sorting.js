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
  var changeA = (reactionA.thisWeek-reactionA.lastWeek)/reactionA.lastWeek;
  var changeB = (reactionB.thisWeek-reactionB.lastWeek)/reactionB.lastWeek;

  if (reactionA.lastWeek===0 && reactionA.thisWeek===0) {
    if (reactionB.lastWeek===0 && reactionB.thisWeek===0) {
      return 0; //If both NaN
    }
    return 1;
  }
    if (reactionB.lastWeek===0 && reactionB.thisWeek===0) {
      return 0;
    }

  if (reactionA.lastWeek===0 && reactionB.lastWeek===0) { //if both infinite check size
      if(reactionA.thisWeek<reactionB.thisWeek) {
        return 1;
      }
      else {
        return 0;
      }
  }
  if (reactionB.lastWeek===0) {//At this point b must be larger than A
    return 1;
  }


  //If neither is NaN or infinity, check for size.
  if (changeA<changeB) {
    return 1;
  }
  return 0;
}

exports.sort = sort;
