
var Discord = require('discord.js');
var auth = require('./auth.json');
var logger = require('./consolelogger');
var utils = require('./utils');

// Initialize Discord Bot
var bot = new Discord.Client({});

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
                msg.channel.send('Die humans die');
            break;
            case 'uptime':
                msg.channel.send(utils.getUptime());
            break;
            // Just add any case commands if you want to..
         }
     }
});
bot.on('messageReactionAdd', function (messageReaction, user) {
  messageReaction.message.channel.send(
    'Someone reacted with an emoji that has the id: '+
    messageReaction.emoji.toString());
});

bot.login(auth.token);
