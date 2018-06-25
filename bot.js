const Discord = require("discord.js");
const bot = new Discord.Client(); 
const config = require("./config.json");
const fs = require("fs");
const mysql = require("mysql");
var itemapicooldown = false;
var globalcooldown = false;
var apiratelimit ;

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
//....................Added API 1min Cooldown Single Item Search................................................//    
    if (command == "mcsearch") {
      if (itemapicooldown == true) return message.reply("Please try again in 1min due to ratelimits.");
        itemapicooldown = true
        setTimeout(() => {
        itemapicooldown = false
      }, 60000);
    } 
//..............................................................................................................//
//....................Added Golbal Spam Cooldown................................................//    
  if (message.content.startsWith("&")) {
    if (globalcooldown == true) return message.reply("Stop that, spam hurts!!");
      globalcooldown = true
      setTimeout((channel, userid) => {
      globalcooldown = false
    }, 2000, message.channel, message.author.id);
  }
  console.log(`User- ${message.author.id} Commaand - ${command} Args - ${args}`)  
//..............................................................................................................//
try {
  
    if (fs.existsSync(`./Commands/${command}.js`) === true){
      let commandFile = require(`./Commands/${command}.js` )
      commandFile.run(bot, message, args);
    } 
      else if (fs.existsSync(`./Commands/NSFWCommands/${command}.js`) === true){
        let commandFile = require(`./Commands/NSFWCommands/${command}.js`)
        commandFile.run(bot, message, args);
      } 
      else if (fs.existsSync(`./Commands/DRPGCommands/${command}.js`) === true) { 
        let commandFile = require(`./Commands/DRPGCommands/${command}.js`)
        commandFile.run(bot, message, args);
      }
      else if (fs.existsSync(`./Commands/ActionCommands/${command}.js`) === true) {
        let commandFile = require(`./Commands/ActionCommands/${command}.js`)
        commandFile.run(bot, message, args);
      }
      else if (fs.existsSync(`./Commands/ImageCommands/${command}.js`) === true) {
        let commandFile = require(`./Commands/ImageCommands/${command}.js`)
        commandFile.run(bot, message, args);
      }
      else if (fs.existsSync(`./Commands/FunCommands/${command}.js`) === true) {
        let commandFile = require(`./Commands/FunCommands/${command}.js`)
        commandFile.run(bot, message, args);
      }


  } catch (err) {
    console.error(err);
  }

});
 
  bot.login(config.token)
