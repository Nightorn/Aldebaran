const CooldownManager = require('./structures/CooldownManager');
const Command = require('./structures/Command');
const config = require("./config.json");
const Discord = require("discord.js");
const bot = new Discord.Client(); 
const fs = require("fs");
const cooldownManager = new CooldownManager();

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      let eventFunction = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      // super-secret recipe to call events with all their proper arguments *after* the `client` var.
      bot.on(eventName, (...args) => eventFunction.run(bot, ...args));
    });
});
 
bot.on("message", message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
  
  	try {
      const isGood = cooldownManager.execute(message.author.id, true, new Command(command), bot, message, args);
      console.log(`User ${message.author.id} (${message.author.tag}) | Command ${command}${args.length === 0 ? '' : ` | Args - ${args}`} | Cooldown : ${isGood ? `GOOD` : `BAD`}`);
  	} catch(err) {
    	if (err.message !== 'Unknown Command') console.error(err);
  	}
});
 
bot.login(config.token);