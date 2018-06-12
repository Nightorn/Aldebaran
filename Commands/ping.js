exports.run = (bot, message, args) => {
    message.reply(`
That only took me ${Math.round(bot.ping)}ms !`);
};