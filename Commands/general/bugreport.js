// Command Developed with the help of Akashic Bearer#2305
const { MessageEmbed } = require('discord.js');
exports.run = function(bot, message, args) {
    if (args.length === 0) return message.channel.send(`You can't send an empty bug report.`);
    const embed = new MessageEmbed()
        .setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.avatarURL())
        .setTitle('New Bug Report')
        .setDescription(args.join(' '))
        .setFooter(`Channel : #${message.channel.name} [ID: ${message.channel.id}] • Server : ${message.guild.name} [ID: ${message.guild.id}]`)
    bot.guilds.get("461792163525689345").channels.get("463094132248805376").send({embed}).then(() => {
        message.channel.send(`Your bug report has been sent to the main server!`);
    });
}

exports.infos = {
    category: "General",
    description: "Sends a bug report",
    usage: "\`&bugreport <bug report>\`",
    example: "\`&bugreport ur bot doesnt work\`",
}
