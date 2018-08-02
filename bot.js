const CooldownManager = require('./structures/CooldownManager');
const Command = require('./structures/Command');
const config = require("./config.json");
const Discord = require("discord.js");
const poolQuery = require("./functions/database/poolQuery");
const bot = new Discord.Client(); 
const fs = require("fs");
const cooldownManager = new CooldownManager();
bot.prefixes = new Map();

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      let eventFunction = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      // super-secret recipe to call events with all their proper arguments *after* the `client` var.
      bot.on(eventName, (...args) => eventFunction.run(bot, ...args));
    });
});
 
bot.on("message", async message => {
    if (message.author.bot) return;
    if (bot.prefixes.get(message.guild.id) === undefined && process.argv.indexOf('debug') === -1) {
        const result = await poolQuery(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`);
        if (Object.keys(result).length !== 0) {
            let guildsettings = JSON.parse(result[0].settings);
            if (guildsettings.aldebaranPrefix !== undefined){
                bot.prefixes.set(message.guild.id, guildsettings.aldebaranPrefix);
            } else {
                bot.prefixes.set(message.guild.id, config.prefix);
            }      
        } else bot.prefixes.set(message.guild.id, config.prefix);
    } else if (process.argv.indexOf('debug') !== -1) {
        bot.prefixes.set(message.guild.id, config.prefix);
    }
    let guildprefix = bot.prefixes.get(message.guild.id);
    
    if (message.content.indexOf(guildprefix) !== 0) return;
    const args = message.content.slice(guildprefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
  	try {
      const isGood = cooldownManager.execute(message.author.id, true, new Command(command), bot, message, args);
      console.log(`User ${message.author.id} (${message.author.tag}) | Command ${command}${args.length === 0 ? '' : ` | Args - ${args}`} | Cooldown : ${isGood ? `GOOD` : `BAD`}`);
  	} catch(err) {
    	if (err.message !== 'Unknown Command') console.error(err);
  	}
});
 
bot.login(config.token);