const { MessageEmbed } = require('discord.js');
exports.run = (bot, message, args) => {
    message.delete().catch(() => {});
    const embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(args.join(' '))
        .setTimestamp(new Date());
    message.channel.send({embed});
};

exports.infos = {
    category: "Fun",
    description: "Make the bot say something.",
    usage: "\`&say <text>\`",
    example: "\`&say hello how are you today?\`"
}