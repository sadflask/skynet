var request = require('request');
var querystring = require("querystring");
var logger = require('./util/consolelogger');

//Query the db for this emoji, uses GET request
getByEmoji = function(emojiName, callback) {
  const options = {
    url: 'http://localhost:28017/api/reactions/'+emojiName
  };
  logger.logMessage('URL to GET: '+options.url);
  const req = request.get(options, callback);
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
  const req = request.put(options, function (error, response, body) {
    if (error) {logger.logError(error);} // Print the error if one occurred
    logger.logMessage(response && response.statusCode); // Print the response status code if a response was received
    logger.logObj(body); // Print the body
  });
}

//Get all emojis for stats, uses GET request
exports.getAndPrint = function(printStats, sorter, channel) {
  const options = {
    url: 'http://localhost:28017/api/reactions/'
  };
  const req = request.get(options, function (error, response, body) {
    if (error) {logger.logError(error);} // Print the error if one occurred
    logger.logMessage(response && response.statusCode); // Print the response status code if a response was received
    var rows =JSON.parse(body).rows; // Extract the rows from the body
    var totalArray = rows.slice(0);
    var weeklyArray = rows.slice(0);
    var changeArray = rows.slice(0); //Slice the array (effectively make 3 copies)
    totalArray = sorter.sort(totalArray, sorter.compareAllTime);
    weeklyArray = sorter.sort(weeklyArray, sorter.compareWeekly);
    changeArray = sorter.sort(changeArray, sorter.compareChange);
    channel.send(printStats(totalArray,weeklyArray,changeArray));
  });
}

//Updates the emoji in the db with value of increment using getByEmoji and putByEmoji
exports.updateEmoji = function (emojiName, increment) {
  getByEmoji(emojiName, function(err, res, body) {
    console.log(body);
    /*if the emoji doesn't exist in the table:
    (reaction==undefined) {
      reaction = {
        emoji: emojiName,
        thisWeek: increment,
        lastWeek: 0,
        total: increment
      }
      logger.logMessage('get failed');
      do a post.
      else do a put.
    } else {
      reaction.thisWeek += increment;
      reaction.total += increment;
    }
    putByEmoji(reaction);*/
  });

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
exports.deleteEmoji = function (emojiName, callback) {
  const options = {
    url: 'http://localhost:28017/api/reactions/'+emojiName,
    json: true
  };
  const req = request.delete(options, callback);
}

exports.deleteAll = function () {
  const options = {
    url: 'http://localhost:28017/api/reactions/',
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
