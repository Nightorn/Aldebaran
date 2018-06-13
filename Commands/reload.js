exports.run = (bot, message, args) => {
  const fs = require(`fs`)
  if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
  // the path is relative to the *current folder*, so just ./filename.js
  if (message.author.id !== '310296184436817930') return message.reply("Fuck Off");
  
  if (fs.existsSync(`./${args[0]}.js`) === true){
    delete require.cache[require.resolve(`./${args[0]}.js`)];
  } 
    else if (fs.existsSync(`./ActionCommands/${args[0]}.js`) === true){
    delete require.cache[require.resolve(`./ActionCommands/${args[0]}.js`)];
  }
    else if (fs.existsSync(`./DRPGCommands/${args[0]}.js`) === true){
    delete require.cache[require.resolve(`./DRPGCommands/${args[0]}.js`)];
  }
    else if (fs.existsSync(`./FunCommands/${args[0]}.js`) === true){
    delete require.cache[require.resolve(`./FunCommands/${args[0]}.js`)];
  }
    else if (fs.existsSync(`./ImageCommands/${args[0]}.js`) === true){
    delete require.cache[require.resolve(`./ImageCommands/${args[0]}.js`)];
  }
    else if (fs.existsSync(`./NSFWCommands/${args[0]}.js`) === true){
    delete require.cache[require.resolve(`./NSFWCommands/${args[0]}.js`)];
  }
  message.delete();
  message.reply(`The command ${args[0]} has been reloaded`);
};