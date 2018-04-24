const Discord = require('discord.js');
const auth = require('./config/auth.json');
const logger = require('./util/consolelogger');
const utils = require('./util/utils');
const printer = require('./util/print.js');
const requester = require('./requester.js');
const sorter = require('./util/sorting.js');
const schedule = require('node-schedule');
const help = require('./util/help.js');

// Initialize Discord Bot
const bot = new Discord.Client({});

let timeOfPrint = Date.now();
let lastUpdateTime = Date.now();

let cachedEmojis = new Map();

const dev = (process.argv[2] === 'dev');

bot.on('ready', () => {
  logger.logMessage('Connected');
  logger.logMessage(`Logged in as: ${bot.user.username} - (${bot.user.id})`);
  requester.init(() => {
    logger.logMessage('Running callback');
    bot.guilds.forEach((value, key) => {
      if (key === '262860303044182019') {
        requester.initEmojis(value);
      }
    });
    schedule.scheduleJob('30 18 * * 5', () => {
      requester.changeWeek();
    });
    // init.initEmojis(requester, bot.guilds[0]);
    return 0;
  });
});

bot.on('message', (msg) => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (dev) {
    if (msg.guild.id !== '249487189623308288') return;
  } else if (!dev) {
    if (msg.guild.id !== '262860303044182019') return;
  }

  if (msg.content.substring(0, 1) === '!') {
    let args = msg.content.substring(1).split(' ');
    const cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      case 'status':
        msg.channel.send('Skynet is online.');
        break;
      case 'uptime':
        msg.channel.send(utils.getUptime());
        break;
      case 'stats':
        if (((Date.now() - timeOfPrint) > 1000 * 60 * 5) || dev) {
          requester.printStats(printer.printStats, sorter, msg.channel);
          timeOfPrint = Date.now();
        } else {
          msg.channel.send('YOU HAVE AWAKENED ME TOO SOON, EXECUTUS!');
        }
        break;
      case 'all':
        requester.getAndPrint(printer.printAll, sorter, msg.channel);
        break;
      case 'week':
        requester.getAndPrint(printer.printWeekly, sorter, msg.channel);
        break;
      case 'change':
        requester.getAndPrint(printer.printChanges, sorter, msg.channel);
        break;
      case 'force':
        msg.channel.send('USING THE FORCE, LUKE');
        // Updates all emojis in database.
        requester.force(cachedEmojis);
        break;
      case 'help':
        msg.channel.send(help.help());
        break;
      default:
        msg.channel.send('DID NOT RECOGNISE COMMAND');
    }
  }
});

// Adds a new messageReaction to the cache, updates cache to db if enough time has passed.
// Listens for the messageReactionAdd event.
bot.on('messageReactionAdd', (messageReaction) => {
  const emojiName = messageReaction.emoji.toString();
  logger.logMessage(`detected: ${emojiName}`);
  if (!emojiName.includes('<')) {
    return;
  }
  // Add to the cache
  if (cachedEmojis.has(emojiName)) {
    cachedEmojis.set(emojiName, cachedEmojis.get(emojiName) + 1);
  } else {
    cachedEmojis.set(emojiName, 1);
  }

  // Update every 5 minutes.
  if (Date.now() - lastUpdateTime > 1000 * 60 * 5) {
    // Updates all emojis in database.
    requester.force(cachedEmojis);
    // Clear the lists
    cachedEmojis = new Map();
    lastUpdateTime = Date.now();
  }
});

// Delete an emoji when the emojiDelete event is fired
bot.on('emojiDelete', (emoji) => {
  // Find id to delete by and pass to deleteEmoji
  requester.deleteEmoji(emoji.toString());
  logger.logMessage(`Deleted emoji: ${emoji.toString()}`);
});

bot.login(auth.token);
