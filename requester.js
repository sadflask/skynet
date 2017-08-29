var request = require('request');
var querystring = require("querystring");
var logger = require('./util/consolelogger');

//Query the db for this emoji, uses GET request
getByEmoji = function(emojiName) {
  const options = {
    url: 'localhost:28017/api/reactions/'+emojiName
  };
  const req = request.get(options, function (error, response, body) {
    logger.logError('error:', error); // Print the error if one occurred
    logger.logMessage('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    logger.logObj('body:', body); // Print the HTML for the Google homepage.
  });

  //Need to extract emoji from body and return it here.
}

//Called to increment emoji, uses PUT request
putByEmoji = function (reaction) {
  const options = {
    url: 'localhost:28017/api/reactions/'+reaction.emoji,
    body: {
      emoji: reaction.emoji,
      lastWeek: reaction.lastWeek,
      thisWeek: reaction.thisWeek,
      count: reaction.count
    },
    json: true
  };
  const req = request.post(options, function (error, response, body) {
    logger.logError('error:', error); // Print the error if one occurred
    logger.logMessage('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    logger.logObj('body:', body); // Print the HTML for the Google homepage.
  });
}

//Get all emojis for stats, uses GET request
exports.getAll = function() {
  const options = {
    url: 'localhost:28017/api/reactions'
  };
  const req = request.get(options, function (error, response, body) {
    logger.logError('error:', error); // Print the error if one occurred
    logger.logMessage('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    logger.logObj('body:', body); // Print the HTML for the Google homepage.
  });
}

//Updates the emoji in the db with value of increment using getByEmoji and putByEmoji
exports.updateEmoji = function (emojiName, increment) {
  var emoji = getByEmoji(emojiName);
  emoji.thisWeek += increment;
  emoji.total += increment;
  putByEmoji(emoji);
}

//Triggered by adding a new emoji, adds it to the db using POST
exports.newEmoji = function (emojiName) {
  const options = {
    url: 'localhost:28017/api/reactions',
    body: {emoji:emojiName},
    json: true
  };
  const req = request.post(options, function (error, response, body) {
    logger.logError('error:', error); // Print the error if one occurred
    logger.logMessage('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    logger.logObj('body:', body); // Print the HTML for the Google homepage.
  });
}

//Removes a reaction from the db using DELETE.
exports.deleteEmoji = function (emojiName) {
  const options = {
    url: 'localhost:28017/api/reactions/'+emojiName,
    json: true
  };
  const req = request.delete(options, function (error, response, body) {
    logger.logError('error:', error); // Print the error if one occurred
    logger.logMessage('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    logger.logObj('body:', body); // Print the HTML for the Google homepage.
  });
}

exports.changeWeek = function () {
  //Get all emoji and clear current week
  //emoji.lastWeek = emoji.thisWeek & emoji.thisWeek=0;

}
