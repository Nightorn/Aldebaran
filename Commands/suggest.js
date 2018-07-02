// Command Developed with the help of Akashic Bearer#2305
const { RichEmbed } = require('discord.js');
exports.run = function(bot, message, args) {
    const embed = new RichEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL)
        .setTitle('New Suggestion')
        .setDescription(args.join(' '))
        .setFooter(`Channel : #${message.channel.name} [ID: ${message.channel.id}] • Server : ${message.guild.name} [ID: ${message.guild.id}]`)
    bot.guilds.get("461792163525689345").channels.get("461802546642681872").send({embed}).then(() => {
        message.channel.send(`Your suggestion has been sent to the main server!`);
    });
}

exports.infos = {
    category: "General",
    description: "Sends a suggestion",
    usage: "\`&suggest <suggestion>\`",
    example: "\`&suggest more nsfw commands\`",
}