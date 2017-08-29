var request = require('request');
var querystring = require("querystring");
var logger = require('./util/consolelogger');

//Query the db for this emoji, uses GET request
getByEmoji = function(emojiName) {
  const options = {
    url: 'http://localhost:28017/api/reactions/'+emojiName
  };
  var reaction= null;
  const req = request.get(options, function (error, response, body) {
    if (error) {logger.logError(error);} // Print the error if one occurred
    else {
      logger.logMessage(response && response.statusCode); // Print the response status code if a response was received
      logger.logObj(body); // Print the body

      //Returns reaction from body.
      reaction = {
        emoji: body.emoji,
        thisWeek: body.thisWeek,
        lastWeek: body.lastWeek,
        count: body.count
      }
      return reaction;
    }
  });

}

//Called to increment emoji, uses PUT request
putByEmoji = function (reaction) {
  const options = {
    url: 'http://localhost:28017/api/reactions/'+reaction.emoji,
    body: {
      emoji: reaction.emoji,
      lastWeek: reaction.lastWeek,
      thisWeek: reaction.thisWeek,
      count: reaction.count
    },
    json: true
  };
  const req = request.post(options, function (error, response, body) {
    if (error) {logger.logError(error);} // Print the error if one occurred
    logger.logMessage(response && response.statusCode); // Print the response status code if a response was received
    logger.logObj(body); // Print the body
  });
}

//Get all emojis for stats, uses GET request
exports.getAll = function() {
  const options = {
    url: 'http://localhost:28017/api/reactions'
  };
  const req = request.get(options, function (error, response, body) {
    if (error) {logger.logError(error);} // Print the error if one occurred
    logger.logMessage(response && response.statusCode); // Print the response status code if a response was received
    logger.logObj(body); // Print the body
  });
}

//Updates the emoji in the db with value of increment using getByEmoji and putByEmoji
exports.updateEmoji = function (emojiName, increment) {
  var reaction = getByEmoji(emojiName);
  if(reaction==undefined) {
    reaction = {
      emoji: emojiName,
      thisWeek: increment,
      lastWeek: 0,
      count: increment
    }
    logger.logMessage('get failed');
  } else {
    reaction.thisWeek += increment;
    reaction.total += increment;
  }
  putByEmoji(reaction);
}

//Triggered by adding a new emoji, adds it to the db using POST
exports.newEmoji = function (emojiName) {
  const options = {
    url: 'http://localhost:28017/api/reactions',
    body: {emoji:emojiName},
    json: true
  };
  const req = request.post(options, function (error, response, body) {
    if (error) {logger.logError(error);} // Print the error if one occurred
    logger.logMessage(response && response.statusCode); // Print the response status code if a response was received
    logger.logObj(body); // Print the body
  });
}

//Removes a reaction from the db using DELETE.
exports.deleteEmoji = function (emojiName) {
  const options = {
    url: 'http://localhost:28017/api/reactions/'+emojiName,
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
