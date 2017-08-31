var Discord = require('discord.js');
var auth = require('./config/auth.json');
var logger = require('./util/consolelogger');
var utils = require('./util/utils');
var printer = require("./util/print.js");
var requester = require("./requester.js");
var sorter = require('./util/sorting.js');

// Initialize Discord Bot
var bot = new Discord.Client({});

var timeOfPrint = Date.now();
var lastUpdateTime = Date.now();

var cachedEmojis = [];
var cachedCounts = [];

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
              if ((Date.now()-timeOfPrint)>1000*60*5) {//Every 5 mins
                requester.getAndPrint(printer.printStats, sorter,msg.channel);
                timeOfPrint = Date.now();
              } else {
                msg.channel.send('YOU HAVE AWAKENED ME TOO SOON, EXECUTUS!');
              }
            break;
            case 'force':
              msg.channel.send('USING THE FORCE, LUKE');
              //Updates all emojis in database.
              for(var i=0;i<cachedEmojis.length;i++) {
                  requester.updateEmoji(cachedEmojis[i],cachedCounts[i]);
              }
              cachedEmojis=[];
              cachedCounts=[];
              lastUpdateTime = Date.now();

            break;
            // Just add any case commands if you want to..
         }
     }
});

//Adds a new messageReaction to the cache, updates cache to db if enough time has passed.
//Listens for the messageReactionAdd event.
bot.on('messageReactionAdd', function (messageReaction, user) {

  const emojiName = messageReaction.emoji.toString();
  logger.logMessage('detected: '+emojiName);
  if(!emojiName.includes('<')) {
    return;
  }
  if(cachedEmojis.indexOf(emojiName)===-1) {
    cachedEmojis.push(emojiName);
    cachedCounts.push(1);
  } else {
    cachedCounts[cachedEmojis.indexOf(emojiName)]++;
  }
  //Log cache
  //messageReaction.message.channel.send('Current cache: '+ cachedEmojis+" , "+'Current counts: '+ cachedCounts);
  //Update every 5 minutes.
  if (Date.now()-lastUpdateTime>1000*60*5) {
    //Updates all emojis in database.
    for(var i=0;i<cachedEmojis.length;i++) {
        requester.updateEmoji(cachedEmojis[i],cachedCounts[i]);
    }
    cachedEmojis=[];
    cachedCounts=[];
    lastUpdateTime = Date.now();
  }
});

//Insert a new emoji when the emojiCreate event is fired
//THIS DOESN"T WORK BECAUSE IT FIRES BEFORE EMOJI NAME IS CHANGED
/*bot.on('emojiCreate', function(emoji) {
  requester.newEmoji(emoji.toString());
  logger.logMessage("Created new emoji: "+emoji.toString());
});*/

//Delete an emoji when the emojiDelete event is fired
bot.on('emojiDelete', function(emoji) {
  //Find id to delete by and pass to deleteEmoji
  requester.deleteEmoji(emoji.toString());
  logger.logMessage("Deleted emoji: "+emoji.toString());
});

bot.login(auth.token);
