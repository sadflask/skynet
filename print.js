const printStats = function(allTime, weekly, changes) {
  let output="SKYNET BOT WEEKLY STATS: \n\
  \n:crown: MOST USED REACTIONS (ALL TIME):\n";
  var curr = null;
  for(var i=0;i<3;i++) {
    curr = allTime[i];
    output+=" " + curr.emoji  + " ("+curr.total+" uses)\n";
  }

  output+="\n:poop: LEAST USED REACTIONS (ALL TIME):\n";
  for(var i=allTime.length-1;i>allTime.length-4;i--) {
    curr = allTime[i];
    output+=" " + curr.emoji  + " ("+curr.total+" uses)\n";
  }

  output+="\n:thumbsup: MOST USED REACTIONS (WEEKLY):\n";
  for(var i=0;i<3;i++) {
    curr = weekly[i];
    output+=" " + curr.emoji  + " ("+curr.thisWeek+" uses this week)\n";
  }

  output+="\n:thumbsdown: LEAST USED REACTIONS (WEEKLY):\n";
  for(var i=weekly.length-1;i>weekly.length-4;i--) {
    curr = weekly[i];
    output+=" " + curr.emoji  + " ("+curr.thisWeek+" uses this week)\n";
  }

  output+="\n:chart_with_upwards_trend: TRENDING REACTIONS:\n";
  for(var i=0;i<3;i++) {
    curr = changes[i];
    output+=" " + curr.emoji  + " ("+curr.thisWeek+" uses)\
    :point_up_2: "+((curr.thisWeek-curr.lastWeek)*100/curr.lastWeek)+"%\n";
  }

  output+="\n:chart_with_downwards_trend: REACTIONS:\n";
  for(var i=changes.length-1;i>changes.length-4;i--) {
    curr = changes[i];
    output+=" " + curr.emoji  + " ("+curr.thisWeek+" uses)\
    :point_down: "+((curr.thisWeek-curr.lastWeek)*100/curr.lastWeek)+"%\n";
  }
  return output;
}

exports.printStats = printStats;
