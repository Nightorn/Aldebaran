// Command Developed with the help of Akashic Bearer#2305
const { MessageEmbed } = require('discord.js');
exports.run = function(bot, message, args) {
    if (args.length === 0) return message.channel.send(`You can't send an empty todo.`);
    const embed = new MessageEmbed()
    .setAuthor(`${message.author.tag} | ${message.author.id}`, message.author.avatarURL())
        .setTitle('Todo Sent')
        .setDescription(args.join(' '))
        .setFooter(`Channel : #${message.channel.name} [ID: ${message.channel.id}] • Server : ${message.guild.name} [ID: ${message.guild.id}]`)
        .setColor(`BLUE`);
    bot.guilds.get("461792163525689345").channels.get("494129501077241857").send({embed}).then(() => {
        message.channel.send(`Your todo has been sent!`);
    });
}

exports.infos = {
    category: "General",
    description: "Sends a suggestion",
    usage: "\`&suggest <suggestion>\`",
    example: "\`&suggest more nsfw commands\`",
    permissions: {
        bot: ["DEVELOPER"]
    }
}