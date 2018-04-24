# Skynet
A reaction bot for discord that tracks custom reaction usage.

This bot is made with node js, and uses lokijs in-memory storage

-Setup

To setup the bot, download this repo, and add a config folder to the root with the file auth.json, containing the token for logging in to discord.
You need to have both npm and node installed.
Run npm install to save dependancies.

-Running the bot

To start the bot, navigate to skynet/ and run node skynet.js

The bot is currently authorized to run in the With A Y guild only.

-Commands

The bot currently supports 3 commands:

-Status: Checks if the bot is online. Should reply with "Skynet is online."

-Stats: Retrieves list of reactions stored in db and prints the stats. Can only be used after a cooldown time.

-Uptime: Replies with how long the bot has been online for.
