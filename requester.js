const logger = require('./util/consolelogger');
const storage = require('./persistance.js');

// THIS IS SHITHOUSE
// Get all emojis for stats, uses getAll
exports.getAndPrint = function getAndPrint(printStats, sorter, channel) {
  logger.logMessage('Printing Stats');
  const reactions = storage.getReactions();
  // Need to check if this still works.
  let totalArray = reactions.slice(0);
  let weeklyArray = reactions.slice(0);
  let changeArray = reactions.slice(0); // Slice the array (effectively make 3 copies)
  totalArray = sorter.sort(totalArray, sorter.compareAllTime);
  weeklyArray = sorter.sort(weeklyArray, sorter.compareWeekly);
  changeArray = sorter.sort(changeArray, sorter.compareChange);

  channel.send(printStats(totalArray, weeklyArray, changeArray));
};

exports.force = function force(cachedEmojis) {
  cachedEmojis.forEach((value, key) => {
    // Update db
    storage.updateReaction(key, value, logger.logError);
  });
};

exports.initEmojis = function initEmojis(guild) {
  // Get all emojis in list
  const reactions = storage.getReactions();
  const emojis = [];
  if (reactions != null) {
    reactions.forEach((reaction) => {
      emojis.push(reaction.emoji);
    });
  }

  // Get all emojis in guild
  guild.emojis.forEach((value) => {
    if (emojis.indexOf(value.toString()) === -1) {
      logger.logMessage(`${value} is not in the db`);
      storage.createReaction(value.toString());
    }
  });
};

exports.init = storage.init;
