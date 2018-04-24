const format = require('./format');

// Returns an array of strings to print one at a time.
exports.printStats = function printStats(allTime, weekly, changes) {
  const output = [];
  output[0] = 'SKYNET BOT STATS: \n\\n\n:crown: MOST USED REACTIONS (ALL TIME):\n';
  let curr = null;
  for (let i = 0; i < 3; i += 1) {
    curr = allTime[i];
    output[0] += ` ${curr.emoji} (${curr.total} uses)`;
  }

  output[1]="\n\n:poop: LEAST USED REACTIONS (ALL TIME):\n";
  for(var i=allTime.length-1;i>allTime.length-4;i--) {
    curr = allTime[i];
    output[1]+=" " + curr.emoji  + " ("+curr.total+" uses) ";
  }

  output[2]="\n\n:thumbsup: MOST USED REACTIONS (WEEKLY):\n";
  for(var i=0;i<3;i++) {
    curr = weekly[i];
    output[2]+=" " + curr.emoji  + " ("+curr.thisWeek+" uses) ";
  }

  output[3]="\n\n:thumbsdown: LEAST USED REACTIONS (WEEKLY):\n";
  for(var i=weekly.length-1;i>weekly.length-4;i--) {
    curr = weekly[i];
    output[3]+=" " + curr.emoji  + " ("+curr.thisWeek+" uses) ";
  }

  output[4]="\n\n:chart_with_upwards_trend: TRENDING REACTIONS:\n";
  for(var i=0;i<3;i++) {
    curr = changes[i];
    output[4]+=" " + curr.emoji  + format.formatChange(curr.thisWeek-curr.lastWeek)+
    format.format((curr.thisWeek-curr.lastWeek)*100/curr.lastWeek);
  }

  output[5]="\n:chart_with_downwards_trend: DYING REACTIONS:\n";
  for(var i=changes.length-1;i>changes.length-4;i--) {
    curr = changes[i];
    output[5]+=" " + curr.emoji  + format.formatChange(curr.thisWeek-curr.lastWeek)+
    format.format((curr.thisWeek-curr.lastWeek)*100/curr.lastWeek);
  }
  return output;
}

//This function takes in the list of emojis sorted by all time usage, and returns an array of formatted output.
exports.printAll = function(allTime) {
  //Each quarter will be added to a different item in the array
  let output = [];
  output[0]="SKYNET BOT STATS (LONG): \n\
  \nMOST USED REACTIONS (ALL TIME):\n";
  for(var i=0;i<allTime.length;i+=4) {
    for(var j=i;j<i+4;j++) {
      if(j<allTime.length) {
        curr = allTime[j];
        output[i+1]+=" " + curr.emoji  + " \`";
        if (curr.total<10) {output[i+1]+="0";}
        if (curr.total<100) {output[i+1]+="0";}
        output[i+1]+=curr.total+"\` ";
      }
    }
    //Not sure if we need this, to remove if it isn't needed.
    //output+="\n";
  }
  return output;
}

//This function takes in the list of emojis sorted by weekly usage, and prints them with their usage.
exports.printWeekly = function(allTime, weekly) {
  let output=[];
  output[0]="SKYNET BOT STATS (LONG): \n\
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

//This function takes in the list of emojis sorted by the change in usage this week, and prints them with their usage.
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
