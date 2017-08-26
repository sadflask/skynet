const sort = function(list, comparator) {
  let sorted = false;
  while(sorted==false) {
    sorted = true;
    var temp = null;
    for(var i=0;i<list.length-1;i++) {
      var swap = comparator(list[i],list[i+1])==1;
      if(swap) {
        //Swap
        //  console.log("Swapping: "+list[i].total+">"+list[i+1].total);
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
    console.log("allTime" +reactionA.total+"<"+reactionB.total);
    return 1;
}
  return 0;
}

exports.compareWeekly = function(reactionA, reactionB) {
  if(reactionA.thisWeek<reactionB.thisWeek) {
    console.log("this week: " +reactionA.thisWeek+"<"+reactionB.thisWeek);
    return 1;
  }
  return 0;
}

exports.compareChange = function(reactionA, reactionB) {
  if((reactionA.thisWeek-reactionA.lastWeek)<(reactionB.thisWeek-reactionB.lastWeek)) {
console.log("change: " +(reactionA.thisWeek-reactionA.lastWeek)+
        "<"+(reactionB.thisWeek-reactionB.lastWeek));
    return 1;
  }
  return 0;
}

exports.sort =sort;
