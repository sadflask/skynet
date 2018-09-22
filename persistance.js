const Loki = require('lokijs');
const logger = require('./util/consolelogger');

let db;
let initialised = false;
let reactions;

const init = (callback) => {
  if (initialised === true) return;
  logger.logMessage('Running init');

  initialised = true;
  db = new Loki('.\\data\\skynet.loki.json');
  logger.logMessage('Database initialised.');
  db.loadDatabase({}, (err) => {
    if (err) logger.logError(err);
    logger.logMessage('Database load attempted');
    reactions = db.getCollection('reactions');
    if (!reactions) {
      reactions = db.addCollection('reactions', {
        indices: 'reaction',
      });
    }
    callback();
  });
};

exports.init = init;

// Private Methods
const addNew = function addNew(emoji, count) {
  return reactions.insert({
    reaction: emoji,
    thisWeek: count,
    lastWeek: 0,
    total: emoji,
  });
};

// CRUD operations
// Create a reaction
exports.createReaction = (reaction, count) => {
  // If the reaction already exists, it is likely an old reaction and should be deleted.
  const foundReaction = reactions.findOne({ reaction });
  if (foundReaction != null) {
    // Delete it before creating a new one
  }
  addNew(reaction, count);
};
// Retrieve all reactions
exports.getReactions = function getReactions(error) {
  if (!reactions) {
    init((err) => {
      if (err) {
        error(err);
      }
      return reactions.find();
    });
  } else {
    return reactions.find();
  }
  return null;
};

// Retrieve by reaction
exports.getReaction = (reaction, error) => {
  const findReaction = () => {
    let foundReaction = reactions.findOne({ reaction });
    if (!foundReaction) {
      // Reaction has not been found, add it
      foundReaction = addNew(reaction, 0);
    }
    return foundReaction;
  };

  if (!reactions) {
    init((err) => {
      if (err) {
        error(err);
      }
      return findReaction(reaction);
    });
  } else {
    return findReaction(reaction);
  }
  return null;
};

// Update by reaction
exports.updateReaction = (reaction, count, error) => {
  // get reaction
  const foundReaction = exports.getReaction(reaction, count, error);
  // Update reaction
  foundReaction.total += count;
  foundReaction.thisWeek += count;
  // Save reaction
  reactions.update(foundReaction);
};

// Delete by reaction
exports.deleteReaction = (reaction) => {
  reactions.delete({ reaction });
};
