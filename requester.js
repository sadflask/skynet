var request = require('request');
var querystring = require("querystring");
var logger = require('./util/consolelogger');
var emoji = require('node-emoji');

//Query the db for this emoji, uses GET request
getByName = function(emojiName, callback) {
  const options = {
    url: 'http://localhost:4500/api/reactions/'+emojiName
  };
  const req = request.get(options, callback);
}

//Called to increment emoji, uses PUT request
putByName = function (reaction) {
  const options = {
    url: 'http://localhost:4500/api/reactions/'+reaction.emoji,
    body: {
      emoji: reaction.emoji,
      lastWeek: reaction.lastWeek,
      thisWeek: reaction.thisWeek,
      total: reaction.total
    },
    json: true
  };
  const req = request.put(options, function (error, response, body) {
    if (error) {logger.logError(error);} // Print the error if one occurred
    logger.logMessage(response && response.statusCode); // Print the response status code if a response was received
    logger.logObj(body); // Print the body
  });
}

//Does a general get call on db then executes callback
exports.getAll = function(callback) {
  const options = {
    url: 'http://localhost:4500/api/reactions/'
  };
  const req = request.get(options, callback);
}

//Get all emojis for stats, uses getAll
exports.getAndPrint = function(printStats, sorter, channel) {
  exports.getAll(function (error, response, body) {
    if (error) {logger.logError(error);} // Print the error if one occurred
    logger.logMessage(response && response.statusCode); // Print the response status code if a response was received
    logger.logObj(JSON.parse(body));
    var reactions = JSON.parse(body).reactions; // Extract the rows from the body
    var totalArray = reactions.slice(0);
    var weeklyArray = reactions.slice(0);
    var changeArray = reactions.slice(0); //Slice the array (effectively make 3 copies)
    totalArray = sorter.sort(totalArray, sorter.compareAllTime);
    weeklyArray = sorter.sort(weeklyArray, sorter.compareWeekly);
    changeArray = sorter.sort(changeArray, sorter.compareChange);
    channel.send(printStats(totalArray,weeklyArray,changeArray));
  });
}

//Updates the emoji in the db with value of increment using getByName and putByName
exports.updateEmoji = function (emojiName, increment) {
  logger.logMessage('Updating: '+emojiName+' by: '+ increment);
  getByName(emojiName, function(err, res, body) {
    var reaction = JSON.parse(body).reaction;
    logger.logObj(JSON.parse(body));
    logger.logMessage('Reaction: '+reaction);
    if (reaction==null) {
      //No existing emoji, insert a new one
      logger.logMessage("Reaction does not exist, creating in DB");
      exports.newEmoji(emojiName, function(err, res, body) {
        reaction = body.reaction;
        reaction = {
          total: reaction.total += increment ,
          thisWeek: reaction.thisWeek += increment,
          lastWeek: reaction.lastWeek,
          emoji: reaction.emoji,
        }
        putByName(reaction);
      });
    } else {
      logger.logMessage('Reaction exists, updating DB');
      reaction = {
        total: reaction.total += increment ,
        thisWeek: reaction.thisWeek += increment,
        lastWeek: reaction.lastWeek,
        emoji: reaction.emoji,
      }
      putByName(reaction);
    }
  });

}

//Triggered by adding a new emoji, adds it to the db using POST
exports.newEmoji = function (emojiName, callback) {
  const options = {
    url: 'http://localhost:4500/api/reactions/',
    body: {emoji:emojiName},
    json: true
  };
  const req = request.post(options, callback);
}

//Removes a reaction from the db using DELETE.
exports.deleteEmoji = function (emojiName, callback) {
  const options = {
    url: 'http://localhost:4500/api/reactions/'+emojiName,
    json: true
  };
  const req = request.delete(options, callback);
}

exports.deleteAll = function () {
  const options = {
    url: 'http://localhost:4500/api/reactions/',
    json: true
  };
  const req = request.delete(options, function (error, response, body) {
    if (error) {logger.logError(error);} // Print the error if one occurred
    logger.logMessage(response && response.statusCode); // Print the response status code if a response was received
    logger.logObj(body); // Print the body
  });

}

exports.changeWeek = function () {
  //Get all emoji and clear current week
  //emoji.lastWeek = emoji.thisWeek & emoji.thisWeek=0;

}
