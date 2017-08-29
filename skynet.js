var Discord = require('discord.js');
var auth = require('./config/auth.json');
var logger = require('./util/consolelogger');
var utils = require('./util/utils');
var printer = require("./util/print.js");
var requester = require("./requester.js");

// Initialize Discord Bot
var bot = new Discord.Client({});

var timeOfPrint = Date.now();
var lastUpdateTime = Date.now();

var cachedEmojis = [];
var cachedCounts = [];

var updateLock = false;

bot.on('ready', function (evt) {
    logger.logMessage('Connected');
    logger.logMessage('Logged in as: '+bot.user.username + ' - (' + bot.user.id + ')');

});
bot.on('message', function(msg) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (msg.content.substring(0, 1) == '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'status':
                msg.channel.send('Skynet is online.');
            break;
            case 'uptime':
                msg.channel.send(utils.getUptime());
            break;
            case 'stats':
                if ((Date.now()-timeOfPrint)>1000*60*5) {
                timeOfPrint = Date.now();
              } else {
                msg.channel.send('YOU HAVE AWAKENED ME TOO SOON, EXECUTUS!');
              }
            break;
            // Just add any case commands if you want to..
         }
     }
});
bot.on('messageReactionAdd', function (messageReaction, user) {
  //Wait for lock to avoid race condition in cache update.
  while (updateLock === true) {}
  updateLock = true;
  const emojiName = messageReaction.emoji.toString();
  if(cachedEmojis.indexOf(emojiName)===-1) {
    cachedEmojis.push(emojiName);
    cachedCounts.push(1);
  } else {
    cachedCounts[cachedEmojis.indexOf(emojiName)]++;
  }
  logger.logMessage("Cache: " + cachedEmojis+'\n' +"Counts: "+cachedCounts);
  messageReaction.message.channel.send('Current cache: '+ cachedEmojis);
  messageReaction.message.channel.send('Current counts: '+ cachedCounts);
  //Update every 5 mins.
  if (Date.now()-lastUpdateTime>1000*30) {
    //Updates all emojis in database.
    for(var i=0;i<cachedEmojis.length;i++) {
      requester.updateEmoji(cachedEmojis[i],cachedCounts[i]);
    }
    cachedEmojis=[];
    cachedCounts=[];
    lastUpdateTime = Date.now();
  }
  updateLock = false;
});

bot.on('emojiCreate', function(emoji) {
  requester.newEmoji(emoji.toString());
  logger.logMessage("Created new emoji: "+emoji.toString());
});

bot.on('emojiDelete', function(emoji) {
  requester.deleteEmoji(emoji.toString());
  logger.logMessage("Deleted emoji: "+emoji.toString());
});



bot.login(auth.token);
