exports.run = (bot, message) => {
    message.reply(`That only took me ${Math.round(bot.ping)}ms !`);
};
exports.infos = {
    category: "General",
    description: "Displays Current Bot Ping",
    usage: "\`&ping\`",
    example: "\`&ping\`",
}