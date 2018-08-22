const CommandManager = require('./structures/CommandManager');
const Command = require('./structures/Command');
const config = require("./config.json");
const Discord = require("discord.js");
const poolQuery = require("./functions/database/poolQuery");
const bot = new Discord.Client(); 
const fs = require("fs");
const commandManager = new CommandManager();

bot.prefixes = new Map();
bot.prefix = config.prefix;
bot.advtimer = new Map();
bot.sidestimer = new Map();
bot.traveltimer = new Map();

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
    if (bot.prefixes.get(message.guild.id) === undefined) {
        const result = await poolQuery(`SELECT * FROM guilds WHERE guildid='${message.guild.id}'`);
        if (Object.keys(result).length !== 0) {
            let guildsettings = JSON.parse(result[0].settings);
            if (guildsettings.aldebaranPrefix !== undefined){
                bot.prefixes.set(message.guild.id, guildsettings.aldebaranPrefix);
            } else {
                bot.prefixes.set(message.guild.id, bot.prefix);
            }      
        } else bot.prefixes.set(message.guild.id, bot.prefix);
    } 

    let guildprefix = bot.prefixes.get(message.guild.id);
    
    if (message.content.indexOf(guildprefix) !== 0) return;
    const args = message.content.slice(guildprefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
  	try {
      const isGood = commandManager.execute(message.author.id, true, command , bot, message, args);
      console.log(`User ${message.author.id} (${message.author.tag}) | Command ${command}${args.length === 0 ? '' : ` | Args - ${args}`} | Cooldown : ${isGood ? `GOOD` : `BAD`}`);
  	} catch(err) {
    	if (err.message !== 'Unknown Command') console.error(err);
  	}
});

if (process.argv[2] === "dev") {
    console.log("Running in dev mode");
    if (process.argv.length < 4) {
        console.log("Please specify a prefix");
        process.exit(0);
    }
    else {
        bot.prefix = process.argv[3];
    }
    bot.login(config.tokendev);
}
else {
    console.log("Running in prod mode")
    bot.login(config.token);
}