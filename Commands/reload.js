exports.run = (bot, message, args) => {
  if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
  // the path is relative to the *current folder*, so just ./filename.js
  if (message.author.id !== '310296184436817930') return message.reply("Fuck Off");
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  message.delete();
  message.reply(`The command ${args[0]} has been reloaded`);
};