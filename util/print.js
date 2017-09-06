const format = require('./format');

exports.printStats = function(allTime, weekly, changes) {
  let output="SKYNET BOT STATS: \n\
  \n\n:crown: MOST USED REACTIONS (ALL TIME):\n";
  var curr = null;
  for(var i=0;i<3;i++) {
    curr = allTime[i];
    output+=" " + curr.emoji  + " ("+curr.total+" uses) ";
  }

  output+="\n\n:poop: LEAST USED REACTIONS (ALL TIME):\n";
  for(var i=allTime.length-1;i>allTime.length-4;i--) {
    curr = allTime[i];
    output+=" " + curr.emoji  + " ("+curr.total+" uses) ";
  }

  output+="\n\n:thumbsup: MOST USED REACTIONS (WEEKLY):\n";
  for(var i=0;i<3;i++) {
    curr = weekly[i];
    output+=" " + curr.emoji  + " ("+curr.thisWeek+" uses) ";
  }

  output+="\n\n:thumbsdown: LEAST USED REACTIONS (WEEKLY):\n";
  for(var i=weekly.length-1;i>weekly.length-4;i--) {
    curr = weekly[i];
    output+=" " + curr.emoji  + " ("+curr.thisWeek+" uses) ";
  }

  output+="\n\n:chart_with_upwards_trend: TRENDING REACTIONS:\n";
  for(var i=0;i<3;i++) {
    curr = changes[i];
    output+=" " + curr.emoji  + format.formatChange(curr.thisWeek-curr.lastWeek)+
    format.format((curr.thisWeek-curr.lastWeek)*100/curr.lastWeek);
  }

  output+="\n:chart_with_downwards_trend: DYING REACTIONS:\n";
  for(var i=changes.length-1;i>changes.length-4;i--) {
    curr = changes[i];
    output+=" " + curr.emoji  + format.formatChange(curr.thisWeek-curr.lastWeek)+
    format.format((curr.thisWeek-curr.lastWeek)*100/curr.lastWeek);
  }
  return output;
}

exports.printAll = function(allTime, weekly) {
  let output="SKYNET BOT STATS (LONG): \n\
  \nMOST USED REACTIONS (ALL TIME):\n";
  for(var i=0;i<allTime.length;i+=4) {
    for(var j=i;j<i+4;j++) {
      if(j<allTime.length) {
        curr = allTime[j];
        output+=" " + curr.emoji  + " \`";
        if (curr.total<10) {output+="0";}
        if (curr.total<100) {output+="0";}
        output+=curr.total+"\` ";
      }
    }
    output+="\n";
  }
  return output;
}

exports.printWeekly = function(allTime, weekly) {
  let output="SKYNET BOT STATS (LONG): \n\
  \nMOST USED REACTIONS (WEEKLY):\n";
  for(var i=0;i<weekly.length;i+=4) {
    for(var j=i;j<i+4;j++) {
      if(j<weekly.length) {
        curr = weekly[j];
        output+=" " + curr.emoji  + " \`";
        if (curr.thisWeek<10) {output+="0";}
        if (curr.thisWeek<100) {output+="0";}
        output+=curr.thisWeek+"\` ";
      }
    }
    output+="\n";
  }
  return output;
}

exports.printChanges = function(allTime, weekly, changes) {
  let output="SKYNET BOT STATS (LONG): \n\
  \nMOST USED REACTIONS (WEEKLY):\n";
  let maxLength = 0;
  for(var i=0;i<changes.length;i++) { //Iterate forwards to find max + value
    curr=changes[i];
    let percentage=(curr.thisWeek-curr.lastWeek)*100/curr.lastWeek;
    if(isFinite(percentage)) {
      if((Math.round(percentage)+'').length>maxLength) {
        maxLength = (Math.round(percentage)+'').length;
        break;
      }
    }
  }
  for(var i=changes.length-1;i>=0;i--) { //Iterate back to find max - value
    curr=changes[i];
    let percentage=(curr.thisWeek-curr.lastWeek)*100/curr.lastWeek;
    if(isFinite(percentage)) {
      if((Math.round(percentage)+'').length>maxLength) {
        maxLength = (Math.round(percentage)+'').length;
        break;
      }
    }
  }
  for(var i=0;i<changes.length;i+=4) {
    for(var j=i;j<i+4;j++) {
      if(j<changes.length) {
        curr = changes[j];
        output+=" " + curr.emoji;
        output+=format.longFormat((curr.thisWeek-curr.lastWeek)*100/curr.lastWeek,maxLength);
      }
    }
    output+="\n";
  }
  return output;
}
