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

  output[1] = ':poop: LEAST USED REACTIONS (ALL TIME):';
  for (let i = allTime.length - 1; i > allTime.length - 4; i -= 1) {
    curr = allTime[i];
    output[1] += ` ${curr.emoji} (${curr.total} uses)`;
  }

  output[2] = ':thumbsup: MOST USED REACTIONS (WEEKLY):';
  for (let i = 0; i < 3; i += 1) {
    curr = weekly[i];
    output[2] += ` ${curr.emoji} (${curr.thisWeek} uses)`;
  }

  output[3] = ':thumbsdown: LEAST USED REACTIONS (WEEKLY):';
  for (let i = weekly.length - 1; i > weekly.length - 4; i -= 1) {
    curr = weekly[i];
    output[3] += ` ${curr.emoji} (${curr.thisWeek} uses)`;
  }

  output[4] = ':chart_with_upwards_trend: TRENDING REACTIONS:\n';
  for (let i = 0; i < 3; i += 1) {
    curr = changes[i];
    output[4] += ` ${curr.emoji} ${format.formatChange(curr.thisWeek - curr.lastWeek)}
    ${format.format(((curr.thisWeek - curr.lastWeek) * 100) / curr.lastWeek)}`;
  }

  output[5] = ':chart_with_downwards_trend: DYING REACTIONS:';
  for (let i = changes.length - 1; i > changes.length - 4; i -= 1) {
    curr = changes[i];
    output[5] += ` ${curr.emoji} ${format.formatChange(curr.thisWeek - curr.lastWeek)}
    ${format.format(((curr.thisWeek - curr.lastWeek) * 100) / curr.lastWeek)}`;
  }
  return output;
};

// Given a list of emojis sorted by all time usage, return an array of formatted output.
exports.printAll = function printAll(allTime) {
  const output = [];
  output[0] = 'SKYNET BOT STATS (LONG): \n\nMOST USED REACTIONS (ALL TIME):';
  for (let i = 0; i < allTime.length; i += 4) {
    // Each quarter will be added to a different item in the array
    for (let j = i; j < i + 4; j += 1) {
      if (j < allTime.length) {
        const curr = allTime[j];
        output[i + 1] += ` ${curr.emoji} \``;
        if (curr.total < 10) output[i + 1] += '0';
        if (curr.total < 100) output[i + 1] += '0';
        output[i + 1] += ` ${curr.total} \``;
      }
    }
  }
  return output;
};

// Given a list of emojis sorted by weekly usage, return an aray of formatted output.
exports.printWeekly = function printWeekly(allTime, weekly) {
  let output = [];
  output[0] = 'SKYNET BOT STATS (LONG):\n\nMOST USED REACTIONS (WEEKLY):';
  for (let i = 0; i < weekly.length; i += 4) {
    for (let j = i; j < i + 4; j += 1) {
      if (j < weekly.length) {
        const curr = weekly[j];
        output += ` ${curr.emoji} \``;
        if (curr.thisWeek < 10) output += '0';
        if (curr.thisWeek < 100) output += '0';
        output += `${curr.thisWeek} \``;
      }
    }
    output += '\n';
  }
  return output;
};

// Given a list of emojis sorted by all time usage, return an aray of formatted output.
exports.printChanges = function printChanges(allTime, weekly, changes) {
  let output = 'SKYNET BOT STATS (LONG): \n\nMOST USED REACTIONS (WEEKLY):\n';
  let maxLength = 0;
  for (let i = 0; i < changes.length; i += 1) {
    const curr = changes[i];
    const percentage = ((curr.thisWeek - curr.lastWeek) * 100) / curr.lastWeek;
    if (isFinite(percentage)) {
      if ((Math.round(percentage)).length > maxLength) {
        maxLength = (`${Math.round(percentage)}`).length;
        break;
      }
    }
  }
  for (let i = changes.length - 1; i >= 0; i -= 1) {
    const curr = changes[i];
    const percentage = ((curr.thisWeek - curr.lastWeek) * 100) / curr.lastWeek;
    if (isFinite(percentage)) {
      if ((Math.round(percentage)).length > maxLength) {
        maxLength = (`${Math.round(percentage)}`).length;
        break;
      }
    }
  }
  for (let i = 0; i < changes.length; i += 4) {
    for (let j = i; j < i + 4; j += 1) {
      if (j < changes.length) {
        const curr = changes[j];
        output += ` ${curr.emoji}`;
        output += format.longFormat(((curr.thisWeek - curr.lastWeek) * 100) / curr.lastWeek,
          maxLength);
      }
    }
    output += '\n';
  }
  return output;
};
